'use strict';


module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {

    function generateUUID() { // Public Domain/MIT
      var d = new Date().getTime();//Timestamp
      var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }


    let interval;
    var io = require('socket.io')(strapi.server.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]

      }
    });

    io.use(async (socket, next) => {


      try {

        //Socket Authentication
        const result = await strapi.plugins[
          'users-permissions'
        ].services.jwt.verify(socket.handshake.auth.token);



        var user = await strapi.entityService.findOne(

          'plugin::users-permissions.user', result.id, {

          fields: ['first_name', 'last_name', 'email', 'id', 'username', 'phone_number']
        });

        //Save the User to the socket connection
        socket.user = user;

        next();
      } catch (error) {


        console.log(error)
      }


    }).on('connection', function (socket) {

      console.log('a user connected');
      if (interval) {
        clearInterval(interval);
      }




      interval = setInterval(async () => {


        try {
          const entries = await strapi.entityService.findMany('api::message.message', {

            filters: {
              $or: [
                {
                  room: {
                    $endsWith: `_${socket.user.username}`,
                  }
                },
                {
                  room: {
                    $startsWith: `${socket.user.username}_`,
                  }
                },
              ],
            },
            sort: { createdAt: 'DESC' },
            populate: { texts: true },
          });



          io.emit('messages', JSON.stringify({ "payload": entries })

          ); // This will emit the event to all connected sockets


        } catch (error) {
          console.log(error);
        }


      }, 2500);




      socket.on('send_message', async (sent_message) => {


        const message = await strapi.db.query('api::message.message').findOne({
          where: { room: sent_message.room },
          populate: { texts: true },
        });


        let new_text = message.texts;
        new_text.push(
          {
            "text": sent_message.text,
            "source": socket.user.id,
            "created": new Date().getTime(),
            "id": generateUUID()
          }
        )



        const entry = await strapi.db.query('api::message.message').update({
          where: { room: sent_message.room },
          data: {
            texts: new_text,
          },
        });


        io.to(sent_message.room).emit("room_messages", JSON.stringify({ message: entry }));


      });

      socket.on('join_room', async (sent_message) => {
        socket.join(sent_message.room);



        const entry = await strapi.db.query('api::message.message').findOne({
          where: { room: sent_message.room },
          populate: { texts: true },
        });

        io.to(sent_message.room).emit("room_messages", JSON.stringify({ message: entry }));


      });


      socket.on('exit_room', (message) => {

        socket.leave(message.room);

      });



      socket.on('disconnect', () => {

        clearInterval(interval);
        console.log('user disconnected');
      });




    });



    return strapi
  },
};
