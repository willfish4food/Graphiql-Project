const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({ 
    name: {
        type: String,
    },
    dscription: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
    },
    clientId: {
        //objectID is a MongoDB type that represents a unique identifier for a document in a collection.
        // the ref property links the Project model to the Client model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    }
});

module.exports = mongoose.model('Project', ProjectSchema);