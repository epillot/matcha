import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';

const styles = {
  root: {
    padding: '10px',
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '3px solid #E0E0E0',
    cursor: 'pointer',
  },
}

export default function(props) {
  const { distance, profilePic, communTags, birthday, login, sexValue } = props.profile;
  const pp = profilePic || 'default.jpg';
  const age = new Date().getFullYear() - new Date(birthday).getFullYear();
  const sex = sexValue === 1 ? 'Man' : 'Woman';
  return (
    <div style={styles.root} onClick={props.onClick}>
      <div>
        <Avatar size={150} src={`/static/${pp}`}/>
      </div>
      <p>
        {`${sex}, ${age}`}
      </p>
      <p>
        {`${communTags} commun tag(s)`}
      </p>
      <p>
        {`About ${Math.floor(distance/1000)} km from you`}
      </p>
    </div>
  );
}
