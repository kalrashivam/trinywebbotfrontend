import React, {Component} from 'react';
import axios from "axios/index";
import Message from './message';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

const cookies = new Cookies();

class Chatbot extends Component {
    messagesEnd;
    constructor(props){
        super(props)
        this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
        this.state= {
            messages: []
        }
        if (cookies.get('userID') === undefined) {
            cookies.set('userID', uuid(), { path: '/' });
        }
        console.log(cookies.get('userID'))
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
        const res = await axios.post('http://localhost:5000/api/df_text_query',  {text: queryText,userID: cookies.get('userID')});
        console.log(res)
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
         const res = await axios.post('http://localhost:5000/api/df_event_query',  {event: eventName, userID: cookies.get('userID')});
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


    componentDidMount() {
        this.df_event_query('Welcome');
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

     _handleInputKeyPress(e) {
        if (e.key === 'Enter') {
            this.df_text_query(e.target.value);
            e.target.value = '';
        }
    }


    renderMessages(returnedMessages) {
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                    return <Message key={i} speaks={message.speaks} text={message.msg.text.text}/>;
                }
            )
        } else {
            return null;
        }
    }


    render() {
        return(
            <div style={{ height: 400, width:400, float: 'right'}}>
                <div id="chatbot"  style={{ height: '100%', width:'100%', overflow: 'auto'}}>
                    <h2>Chatbot</h2>
                    {this.renderMessages(this.state.messages)}
                    <div style={{ float:"left", clear: "both" }}
                         ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>
                <input type="text"  />
                <input type="text" onKeyPress={this._handleInputKeyPress} />
            </div>
        )
    }  

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    
   
};

export default Chatbot;