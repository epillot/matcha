import React from 'react';
import Avatar from 'material-ui/Avatar';
import LikeIcon from 'material-ui/svg-icons/toggle/star-border';

const styles = {
  root: {
    padding: '10px',
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '3px ridge #E0E0E0',
    cursor: 'pointer',
  },
  top: {
    display: 'flex',
    alignItems: 'center',
  },
  popularity: {
    fontSize: '20px',
  },
  login: {
    fontWeight: 'bold',
    fontSize: '18px',
  },
}

export default function(props) {
  const { distance, profilePic, communTags, birthday, login, sexValue, popularity } = props.profile;
  const pp = profilePic || 'default.jpg';
  const age = new Date().getFullYear() - new Date(birthday).getFullYear();
  const sex = sexValue === 1 ? 'Man' : 'Woman';
  //styles.root.borderColor = sex === 'Man' ? '#BBDEFB' : '#FFCDD2'
  return (
    <div style={styles.root} onClick={props.onClick}>
      <div style={styles.top}><LikeIcon/> <span style={styles.popularity}>{popularity}</span></div>
      <p>
        <span style={styles.login}>{login}</span>
      </p>
      <div>
        <Avatar size={130} src={`/static/${pp}`}/>
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
