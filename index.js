const Hapi = require('@hapi/hapi');
const inert = require('@hapi/inert');             // require modules
const vision = require('@hapi/vision');
const hapiSwagger = require('hapi-swagger');
const Joi = require('joi');
const pack = require('./package.json');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/userInfo");      //mongoDb connection

const userSchema = new mongoose.Schema({                 // schema creation
    name: String,
    email: String,
    password: String
})
const User = mongoose.model("User", userSchema);          // model creation

const init = async () => {

    const server = Hapi.server({                         // server craetion
        port: 3000,
        host: 'localhost'
    });

    await server.register([inert,vision,{                //hapiswagger plugin / register
        plugin: hapiSwagger,
        options: {
            info:{
                title: "Test Api Documentation",
                version : pack.version,
            }
        }
    }])

    server.route({                                  // route
        method: 'GET',
        path: '/',
        handler: function(request, h){
            return h.file("views/index.html");
        },
        options: {
            tags: ["api"],
           
        }

    })

    server.route({
        method: 'POST',
        path: '/',
        handler: async function(request, h){
            const user = await User.create({name: request.payload.name, age:request.payload.age })
            return "HI " + user.name + ". You are " + user.age + " years old." ;
        },
        options: {
            tags: ["api"],
            validate: {
                payload: Joi.object({
                    name : Joi.string(),
                    age : Joi.number()
                })
            }
        }

    })

    server.route({
        method: 'DELETE',
        path: '/',
        handler: function(request, h){
            return "Deleted Succesfully"
        },
        options: {
            tags: ["api"],
           
        }

    })


    server.route({
        method: 'GET',
        path: '/user',
        handler:  async function(request,h) {
            const users = await User.find()

            return users;
        },
        options: {
            tags: ["api"],
        }
    })
    server.route({
        method: 'POST',
        path: '/user',
        handler:  function(request,h) {
            return "Saving Users data in database"
        },
        options: {
            tags: ["api"],
        }
    })
    server.route({
        method: 'PUT',
        path: '/user',
        handler:  function(request,h) {
            return "Updating Usera"
        },
        options: {
            tags: ["api"],
        }
    })
    server.route({
        method: 'DELETE',
        path: '/user',
        handler:  function(request,h) {
            return "Deleting Users"
        },
        options: {
            tags: ["api"],
        }
    })

    server.route({
        method: 'POST',
        path: '/formsubmission',
        handler:async function(request,h) {
            const user = await User.create({name: request.payload.name, email:request.payload.email, password:request.payload.password })
            return "You have successfully submited the form";
        },
        options: {
            tags: ["api"],
            validate: {
                payload: Joi.object({
                    name : Joi.string().required(),
                    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
password: Joi.string().min(8).max(15).required(),
             
                })
            }
        }


    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();