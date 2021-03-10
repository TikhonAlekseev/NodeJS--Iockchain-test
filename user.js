const fs = require("fs")
const path = require("path")
class User{
    constructor(id,key){
        this.id = id
        this.key = key
        this.vETH = 1
    }

    toJSON(){
        return{
            id:this.id,
            key :this.key ,
            vETH :this.vETH 
        }
    }

    async save(){
        const users = await User.getUsers() 
        users.push(this.toJSON())
        return new Promise((resolve , reject) => {
            fs.writeFile(
                path.join(__dirname,'data','users.json'),
                JSON.stringify(users),
                (err)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve()
                    }
                }
            )
        })
    }

    static getUsers(){
        return new Promise((resolve,reject) => {
            fs.readFile(
                path.join(__dirname,'data','users.json'),
                'utf-8',
                (err,content) => {
                    if(err) {
                        reject(err) 
                    }else{
                        resolve(JSON.parse(content))
                    }
                }
            )
        })
        
    }

    static async findUser(ip){
        const users = await User.getUsers()
        const user = users.findIndex(item => {return item.id === ip})
        if(user === -1){
            return user
        }else{
            return  users[user]
        }
        
    }
    static async getBalance(ip){
        const user = await User.findUser(ip)
        const balance = user.vETH
        return balance
    }

    static async addAmount(ip,timeClick){
            if(timeClick){
                const users = await User.getUsers()
                const userIndex = users.findIndex((item) => item.id == ip)
                users[userIndex].vETH = (users[userIndex].vETH - 0.05).toFixed(2)
                if(users[userIndex].vETH < 0){
                    users[userIndex].vETH = 0
                }

                return new Promise((resolve , reject) => {
                    fs.writeFile(
                        path.join(__dirname,'data','users.json'),
                        JSON.stringify(users),
                        (err)=>{
                            if(err){
                                reject(err)
                            }else{
                                resolve()
                            }
                        }
                    )
                })
            }else{
                const users = await User.getUsers()
                const userIndex = users.findIndex((item) => item.id == ip)
                users[userIndex].vETH =+ users[userIndex].vETH + 0.95
                return new Promise((resolve , reject) => {
                    fs.writeFile(
                        path.join(__dirname,'data','users.json'),
                        JSON.stringify(users),
                        (err)=>{
                            if(err){
                                reject(err)
                            }else{
                                resolve()
                            }
                        }
                    )
                })
            }
            
    }
}

module.exports = User


