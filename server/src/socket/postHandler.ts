import {Server, Socket} from "socket.io"
import postController from '../controllers/post';
import {DefaultEventsMap} from "socket.io/dist/typed-events"

export = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
            socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    
    const getAllPosts = async () => {
        const res = await postController.getAllPostsEvent()
        socket.emit('post:get_all', res)
    }

    const getPostById = (payload) => {
        socket.emit('echo:echo', payload)
    }

    const addNewPost = (payload) => {
        socket.emit('echo:echo', payload)
    }

    
    socket.on("post:get_all", getAllPosts)
    socket.on("post:get_by_id", getPostById)
    socket.on("post:add_new", addNewPost)
   }