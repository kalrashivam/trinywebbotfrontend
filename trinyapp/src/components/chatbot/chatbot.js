import React, {Component} from 'react';
import axios from "axios/index";

class Chatbot extends Component {
    constructor(props){
        super(props)

        this.state= {
            messages: []
        }
    }


    render() {
        return(
            <div style={{ height: 400, width:400, float: 'right'}}>
                <div id="chatbot"  style={{ height: '100%', width:'100%', overflow: 'auto'}}>
                    <h2>Chatbot</h2>
                    Here we will display messages
                </div>
                <input type="text" placeholder="type your request here"  />
            </div>
        )
    }  
    
    async df_text_query (queryText) {
        let msg;
        let says = {
            speaks: 'user',
            msg: {
                text : {
                    text: queryText
                }
            }
        }
        this.setState({ messages: [...this.state.messages, says]});
        const res = await axios.post('http://localhost:5000/api/df_text_query',  {text: queryText});
         if (res.data.fulfillmentMessages ) {
            for (let i = 0; i < res.data.fulfillmentMessages.length; i++) {
                msg = res.data.fulfillmentMessages[i];
                says = {
                    speaks: 'bot',
                    msg: msg
                }
                this.setState({ messages: [...this.state.messages, says]});
            }
        }
    };
     async df_event_query(eventName) {
         const res = await axios.post('http://localhost:5000/api/df_event_query',  {event: eventName});
        let msg, says = {};
         if (res.data.fulfillmentMessages ) {
            for (let i=0; i<res.data.fulfillmentMessages.length; i++) {
                msg = res.data.fulfillmentMessages[i];
                says = {
                    speaks: 'bot',
                    msg: msg
                }
                 this.setState({ messages: [...this.state.messages, says]});
            }
        }
    };

    
   
};

export default Chatbot;