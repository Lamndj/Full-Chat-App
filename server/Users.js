const Users = [];

const AddUser = ({id,name,room}) => {

    name=name.trim().toLowerCase();
    room=room.trim().toLowerCase();
    const existingUser = Users.find((user) => user.room===name || user.name===name)

    if(existingUser){
        return {error: "Username already taken"}
    }

    const user = {id,name,room}
    Users.push(user);
    return {user}
}

const RemoveUser = (id) => {
    
    const index = Users.findIndex((user) => user.id===id)
    if(index!==-1){
        return Users.splice(index,1)[0]
    }
}

const GetUser = (id) => Users.find((user) => user.id===id)

const GetUserInRoom = (room) => Users.filter((user) => user.room===room)

module.exports = {AddUser,RemoveUser,GetUser,GetUserInRoom}