import server from "../app"
import mongoose from "mongoose"
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter"
import request from 'supertest'
import Post from '../models/post_model'
import User from '../models/user_model'

const userEmail = "user1@gmail.com"
const userPassword = "12345"
let accessToken = ''

let clientSocket: Socket<DefaultEventsMap, DefaultEventsMap>


function clientSocketConnect():Promise<string>{
    return new Promise((reslove)=>{
        clientSocket.on("connect", ()=>{
            reslove("1")
        })
    })
}

describe("my awesome project", () => {

    beforeAll(async () => {
        await Post.remove()
        await User.remove()
        await request(server).post('/auth/register').send({
            "email": userEmail,
            "password": userPassword
        })
        const response = await request(server).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword
        })
        accessToken = response.body.accessToken

        clientSocket = Client("http://localhost:" + process.env.PORT, {
            auth: {
                token: 'barrer ' + accessToken
            }
        })
        await clientSocketConnect()
    });
    
    afterAll(() => {
        server.close()
        clientSocket.close()
        mongoose.connection.close()
    });

    test("should work", (done) => {
        clientSocket.onAny((eventName,arg) => {
            console.log('echo:echo')
            expect(eventName).toBe('echo:echo');
            expect(arg.msg).toBe('hello');
            clientSocket.removeAllListeners()
            done();
        });
        clientSocket.emit("echo:echo", {'msg':'hello'})
    });

    test("Post get all test", (done) => {
        clientSocket.onAny((eventName,arg) => {
            console.log('on any ' + arg)
            expect(eventName).toBe('post:get_all');
            expect(arg.status).toBe('OK');
            clientSocket.removeAllListeners()
            done();
        });
        clientSocket.emit("post:get_all")
    });
});