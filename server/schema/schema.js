// mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql');

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        // make client part of project so we can return the client objects in querys
        client: {
            type: ClientType,
            resolve(parent, args) {
                //the parent is the project and args is the clientId
                return Client.findById(parent.clientId);
            }
        }
    })
})

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        //get all projects
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                //pull projects from database
                return Project.find();
            },
        },
        //get one project
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) { 
                return Project.findById(args.id);
            },
        },
        //get all clients
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                //return all clients
                return Client.find();
            },
        },
        //get one client
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) { 
                // return client by id
                return Client.findById(args.id);
            },
        },
    },
})

// this is how you would add a new client based on the mutation below
// the id that is returned is created by mongoose
// addClient(name: "Tony Stark", email: "ironman@gmail.com", phone: "955-365-3376") {
//        id
//        name
//        email
//        phone
//      }
//    }
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                //args are fields that we want to add to the database
                // if you want to force that the field isnt null you bring in graphQLNonNull
                name: { type: GraphQLNonNull(GraphQLString)},
                email: { type: GraphQLNonNull(GraphQLString)},
                phone: { type: GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args) {
                //create a new client by passing in the arguments of the graphql query
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                //return the client and save it to the database
                return client.save();
            },
        },
        // delete a client
        deleteClient: {
            type: ClientType,
            args: { 
                id: { type: GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                Project.find({ clientId: args.id }).then(projects => {
                    projects.forEach(project => {
                        project.remove();
                    });
                });
                // find the client by id and delete it
                return Client.findByIdAndRemove(args.id);
            },
        },
        // add a project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
                description: { type: GraphQLNonNull(GraphQLString)},
                status:  {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: { 
                            'new': { value: 'Not Started' },
                            'progress': { value: 'In Progress' },
                            'completed': { value: 'Completed' },
                        }
                    }),
                    defaultValue:'Not Started',
                },
                clientId: { type: GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                // create a new project by passing in the arguments of the graphql query
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });
                //return the project and save it to the database
                return project.save();
            },
        },
        // Delete a project
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                // find the project by id and delete it
                return Project.findByIdAndRemove(args.id);
            },
        },
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID)},
                name: { type: GraphQLString},
                description: { type: GraphQLString},
                status:  {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            'new': { value: 'Not Started' },
                            'progress': { value: 'In Progress' },
                            'completed': { value: 'Completed' },
                        },
                    }),
                },
            },
            resolve(parent, args) {
                // find the project by id and update it
                return Project.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        description: args.description,
                        status: args.status,
                    },
                },
                // if the project is updated successfully return the project
                { new: true }
                );
            },
        },

    },
 });

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation,
})
