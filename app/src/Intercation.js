import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import LikeIcon from 'material-ui/svg-icons/toggle/star-border';
import UnlikeIcon from 'material-ui/svg-icons/toggle/star';
import BlockIcon from 'material-ui/svg-icons/notification/do-not-disturb-on';
import UnblockIcon from 'material-ui/svg-icons/notification/do-not-disturb-off';
import ReportIcon from 'material-ui/svg-icons/action/visibility';
import UnreportIcon from 'material-ui/svg-icons/action/visibility-off';
import secureRequest from './secureRequest';


const styles = {
  likeicon: {
    width: '30px',
    height: '30px',
    color: '#FDD835',
  },
  blockicon: {
    width: '30px',
    height: '30px',
    color: '#E57373',
  },
  reporticon: {
    width: '30px',
    height: '30px',
    color: '#9E9E9E',
  },
  small: {
    width: '60px',
    height: '60px',
    padding: '15px',
  },
}

export default class extends Component {

  constructor() {
    super();
    this.state = {
      like: false,
      block: false,
      report: false,
    };
    this.interact = this.interact.bind(this);
  }

  interact(action) {
    const { loggued, id } = this.props;
    const config = {
      method: 'post',
      url: '/api/interaction',
      data: {
        target: id,
        action,
      },
    };
    secureRequest(config, (err, response) => {
      if (err) return this.props.onLogout();
      this.setState(state => {
        state[action] = !state[action];
        return state;
      });
      // if (action === 'like') {
      //   const config = {
      //     method: 'post',
      //     url: '/api/notifications',
      //     data: {
      //       to: id,
      //       object: 'like',
      //     },
      //   };
      //   secureRequest(config)
      //   global.socket.emit('like', {id});
      // }
    });
  }

  render() {
    const { like, block, report } = this.state;
    return (
      <div>
        <IconButton
          iconStyle={styles.likeicon}
          style={styles.small}
          tooltip={like ? 'Unlike this profile' : 'Like this profile'}
          onTouchTap={() => this.interact('like')}
        >
          {like ? <UnlikeIcon/> : <LikeIcon/>}
        </IconButton>
        <IconButton
          iconStyle={styles.blockicon}
          style={styles.small}
          tooltip={block ? 'Unblock this profile' : 'Block this profile'}
          onTouchTap={() => this.interact('block')}
        >
          {block ? <UnblockIcon/> : <BlockIcon/>}
        </IconButton>
        <IconButton
          iconStyle={styles.reporticon}
          style={styles.small}
          tooltip={report ? 'Cancel your report' : 'Report this profile as fake'}
          onTouchTap={() => this.interact('report')}
        >
          {report ? <UnreportIcon/> : <ReportIcon/>}
        </IconButton>
      </div>
    );
  }

}
