import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import LikeIcon from 'material-ui/svg-icons/toggle/star-border';
import UnlikeIcon from 'material-ui/svg-icons/toggle/star';
import BlockIcon from 'material-ui/svg-icons/notification/do-not-disturb-on';
import UnblockIcon from 'material-ui/svg-icons/notification/do-not-disturb-off';
import ReportIcon from 'material-ui/svg-icons/action/visibility';
import UnreportIcon from 'material-ui/svg-icons/action/visibility-off';
import MsgIcon from 'material-ui/svg-icons/communication/email';
import secureRequest from '../../secureRequest';


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
  msgicon: {
    width: '30px',
    height: '30px',
    color: '#B0BEC5',
  },
  small: {
    width: '60px',
    height: '60px',
    padding: '15px',
  },
}

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      like: props.liked,
      block: props.blocked,
      report: props.reported,
      loading: {},
    };
    this.interact = this.interact.bind(this);
  }

  async interact(action) {
    if (this.state.loading[action]) return;
    const { id } = this.props;
    let config = {
      method: 'post',
      url: '/api/interaction',
      data: {
        target: id,
        action,
      },
    };
    this.setState({loading: {[action] : true}});
    try {
      const { data: { status } } = await secureRequest(config);
      this.setState(state => {
        return {
          [action]: !state[action],
          loading: {[action]: false},
        }
      });
      if (action === 'like') {
        config = {
          method: 'post',
          url: '/api/notifications',
          data: {
            to: id,
            object: status,
          },
        };
        secureRequest(config);
      }
    } catch(e) {
      if (e === 'Unauthorized') this.props.onAuthFailed();
      else console.log(e);
    }
  }

  render() {
    const { like, block, report, loading } = this.state;
    const { history, id } = this.props;
    return (
      <div>
        <IconButton
          iconStyle={styles.likeicon}
          style={styles.small}
          tooltip={like ? 'Unlike this profile' : 'Like this profile'}
          onTouchTap={() => this.interact('like')}
          disabled={!!loading.like}
        >
          {like ? <UnlikeIcon/> : <LikeIcon/>}
        </IconButton>
        {this.props.isMatch ?
        <IconButton
          iconStyle={styles.msgicon}
          style={styles.small}
          onTouchTap={() => history.push('/message?' + id)}
        >
          <MsgIcon/>
        </IconButton>
        : null}
        <IconButton
          iconStyle={styles.blockicon}
          style={styles.small}
          tooltip={block ? 'Unblock this profile' : 'Block this profile'}
          onTouchTap={() => this.interact('block')}
          disabled={!!loading.block}
        >
          {block ? <UnblockIcon/> : <BlockIcon/>}
        </IconButton>
        <IconButton
          iconStyle={styles.reporticon}
          style={styles.small}
          tooltip={report ? 'Cancel your report' : 'Report this profile as fake'}
          onTouchTap={() => this.interact('report')}
          disabled={!!loading.report}
        >
          {report ? <UnreportIcon/> : <ReportIcon/>}
        </IconButton>
      </div>
    );
  }

}
