import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia } from 'material-ui/Card';

const style = {
  card: {
    width: '400px',
  },
  cardMedia: {
    width: '400px',
    height: '300px',
  },
  imgMedia: {
    width: '100%',
    height: '100%',
  }
}

export default class extends Component {

   render() {
     const { pic, user: { firstname, lastname, login } } = this.props;
     return (
       <Card>
         <CardHeader
           title={`${firstname} ${lastname}`}
           subtitle={`alias ${login}`}
           avatar="static/default.jpg"
         />
         <CardMedia>
           <img src={`static/${pic}`} alt="" />
         </CardMedia>
       </Card>
     );
   }
}
