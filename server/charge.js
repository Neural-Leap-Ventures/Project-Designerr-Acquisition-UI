const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_DEPLOY_DESIGNER)
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
var db = mongoose.connection;

const paymentSchema = new mongoose.Schema({
  pid: { type: String, required: true },
  created: { type: String },
  status: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, require: true },
});

// eslint-disable-next-line import/no-anonymous-default-export
exports.handler = async (req, res) => {
  if (req.httpMethod === 'POST') {
    try {
      var { items } = req.body;
      console.log("Body infor", items[0].id);
      if (items[0].id === "onload") {
        res.send({
          clientSecret: "paymentIntent.client_secret"
        });
      } else {
        db.once('open', function () {
          console.log("Connection Successful!");
        });
        // console.log("This is comming", req)
        const { items } = req.body;
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
          //amount: calculateOrderAmount(items),
          amount: 10000,
          currency: "inr",
          description: "Boomer Backer Testing",
          payment_method_types: ['card'],
        });

        //console.log("Payment info", paymentIntent)
        const paymentData = {
          pid: paymentIntent.id,
          created: paymentIntent.created,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          description: paymentIntent.description,
          timestamp: new Date(),
        };

        const Payment = mongoose.model('payments', paymentSchema);

        const newPayment = new Payment(paymentData);

        newPayment.save()
          .then(() => {
            console.log('Payment saved to database');
          })
          .catch(err => {
            console.log('Error saving payment to database', err);
          });

        //console.log(paymentIntent.client_secret);
        res.send({
          clientSecret: paymentIntent.client_secret
        });
      }

    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: err.message }),
      }
      //res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'METHOD NOT ALLOWED' }),
    }
  }
}


// exports.handler = async (event, context) => {
//   if (event.httpMethod === 'POST') {
//     try {
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: 10000,
//         currency: 'usd',
//       })
//       console.log(paymentIntent)
//       return {
//         statusCode: 200,
//         body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
//       }
//       //res.status(200).send(paymentIntent.client_secret);
//     } catch (err) {
//       return {
//         statusCode: 500,
//         body: JSON.stringify({ message: err.message }),
//       }
//       //res.status(500).json({ statusCode: 500, message: err.message });
//     }
//   } else {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ message: 'METHOD NOT ALLOWED' }),
//     }
//   }
// }
