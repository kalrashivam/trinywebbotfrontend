import React, {Component} from 'react';
import axios from "axios/index";
import Message from './message';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';
import Card from './card';
import QuickReplies from './QuickReplies';

const cookies = new Cookies();

class Chatbot extends Component {
    messagesEnd;
    constructor(props){
        super(props)
        this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);
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
                console.log(JSON.stringify(msg));
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

    _handleQuickReplyPayload(text) {
        this.props.df_text_query(text);
    }


    renderCards(cards) {
        return cards.map((card, i) => <Card key={i} payload={card.structValue}/>);
    }

    renderOneMessage(message, i) {
        if (message.msg && message.msg.text && message.msg.text.text) {
           return <Message key={i} speaks={message.speaks} text={message.msg.text.text}/>;
       } else if (message.msg && message.msg.payload.fields.cards) { //message.msg.payload.fields.cards.listValue.values
            return <div key={i}>
               <div className="card-panel grey lighten-5 z-depth-1">
                   <div style={{overflow: 'hidden'}}>
                       <div className="col s2">
                           <a className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
                       </div>
                       <div style={{ overflow: 'auto', overflowY: 'scroll'}}>
                           <div style={{ height: 300, width:message.msg.payload.fields.cards.listValue.values.length * 270}}>
                               {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                           </div>
                       </div>
                   </div>
               </div>
           </div>

} else if (message.msg &&
    message.msg.payload &&
    message.msg.payload.fields &&
    message.msg.payload.fields.quick_replies
) {
    return <QuickReplies
        text={message.msg.payload.fields.text ? message.msg.payload.fields.text : null}
        key={i} r
        eplyClick={this._handleQuickReplyPayload}
        speaks={message.speaks}
        payload={message.msg.payload.fields.quick_replies.listValue.values}/>;
       }
   }


    renderMessages(returnedMessages) {
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                return this.renderOneMessage(message, i);
                }
            )
        } else {
            return null;
        }
    }


    render() {
        return(
            <div style={{ minHeight: 500, maxHeight: 500, width:400, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgray'}}>
            <nav>
                <div className="nav-wrapper">
                    <a className="brand-logo">ChatBot</a>
                </div>
            </nav>
             <div id="chatbot"  style={{ minHeight: 388, maxHeight: 388, width:'100%', overflow: 'auto'}}>
                    {this.renderMessages(this.state.messages)}
                    <div style={{ float:"left", clear: "both" }}
                         ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>
                <div className=" col s12" >
                    <input style={{margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%'}} ref={(input) => { this.talkInput = input; }} placeholder="type a message:"  onKeyPress={this._handleInputKeyPress} id="user_says" type="text" />
                </div>
            </div>
        )
    }  

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    
   
};

export default Chatbot;