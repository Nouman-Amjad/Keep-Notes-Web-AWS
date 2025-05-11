const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Initialize DynamoDB DocumentClient and S3 client
const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

// Environment variables for table and bucket names
const NOTES_TABLE = process.env.NOTES_TABLE;
const S3_BUCKET = process.env.S3_BUCKET;
const SIGNED_URL_EXPIRATION = parseInt(process.env.SIGNED_URL_EXPIRATION || '300');

// Create a new note
exports.createNote = async (data) => {
  const timestamp = new Date().toISOString();
  const noteId = uuidv4();

  const note = {
    noteId,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...data,
    attachments: []
  };

  const params = {
    TableName: NOTES_TABLE,
    Item: note
  };

  await docClient.put(params).promise();
  return note;
};

// Retrieve all notes
exports.getNotes = async () => {
  const params = { TableName: NOTES_TABLE };
  const result = await docClient.scan(params).promise();
  return result.Items;
};

// Retrieve a single note by ID
exports.getNoteById = async (noteId) => {
  const params = {
    TableName: NOTES_TABLE,
    Key: { noteId }
  };
  const result = await docClient.get(params).promise();
  return result.Item;
};

// Update a note
exports.updateNote = async (noteId, data) => {
  const timestamp = new Date().toISOString();
  let UpdateExpression = 'set updatedAt = :updatedAt';
  const ExpressionAttributeValues = {
    ':updatedAt': timestamp
  };

  for (const [key, value] of Object.entries(data)) {
    UpdateExpression += `, ${key} = :${key}`;
    ExpressionAttributeValues[`:${key}`] = value;
  }

  const params = {
    TableName: NOTES_TABLE,
    Key: { noteId },
    UpdateExpression,
    ExpressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  };

  const result = await docClient.update(params).promise();
  return result.Attributes;
};

// Delete a note
exports.deleteNote = async (noteId) => {
  const params = {
    TableName: NOTES_TABLE,
    Key: { noteId }
  };
  await docClient.delete(params).promise();
  return { noteId };
};

// Generate a presigned URL for uploading attachments
exports.generateUploadUrl = async (noteId) => {
  const uploadUrl = await s3.getSignedUrlPromise('putObject', {
    Bucket: S3_BUCKET,
    Key: noteId,
    Expires: SIGNED_URL_EXPIRATION
  });

  // Update the note with its attachment URL (public)
  const attachmentUrl = `https://${S3_BUCKET}.s3.amazonaws.com/${noteId}`;
  const updateParams = {
    TableName: NOTES_TABLE,
    Key: { noteId },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl
    }
  };
  await docClient.update(updateParams).promise();

  return { uploadUrl };
};
