import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';


const app = express() 
const port = process.env.PORT || 9000


const pusher = new Pusher({
    appId: '1068546',
    key: '0bcc8d8b06173380dabd',
    secret: '403f4618e8b3c417fd45',
    cluster: 'ap2',
    encrypted: true
  });

  const db=mongoose.connection

  db.once('open' , ()=>{
      console.log('con');

      const msgCollection = db.collection('messagecontents');
      const changeStream = msgCollection.watch();

changeStream.on('change',(change) => {
    console.log(change);

if(change.operationType === 'insert') {
    const messageDetails = change.fullDocument;
    pusher.trigger('messages' , 'inserted',{
        
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
    
    }
    );
}else{
    console.log('error tri. push')
}




})

  })

app.use(express.json());

app.use(cors());




const connection_url='mongodb+srv://admin:5ixuYwU18q6EiKvD@cluster0.dqbdv.mongodb.net/backend?retryWrites=true&w=majority'

mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB Connected"));

app.get('/',(req,res)=>res.status(200).send('hello world')); 

app.post('/',(req,res)=>{

});







app.get('/messages/sync',(req,res) => {
    Messages.find((err,data) =>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    });
});
    








app.post('/messages/new', (req,res) => {
    const dbMessage = req.body

Messages.create(dbMessage,(err,data) => {
if(err){
    res.status(500).send(err)
}else{
    res.status(201).send("done bhbhbhbhhhbh")
}
})

})






app.listen(port,()=>console.log(`listen on:${port}`));


 //5ixuYwU18q6EiKvD mongo pass admin