import React, {Component} from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'

import {
    ImageInput,
    ImageField
} from 'admin-on-rest';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentCancel from 'material-ui/svg-icons/content/clear';

const styles = {
    container: {
        width: '150px',
        height: '150px',
        position: 'relative'
    },
    blur: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        'display': '-webkit-flex',
        'display': 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
    },
    iconCancel: {
        position: 'absolute',
        right: -15,
        top: -15
    },
    img: {
        width: '150px',
        height: '150px'
    }
};


class Accept extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: props.input.value || []
        };
        const {source} = props;

        this.cancelImg = this.cancelImg.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let files = nextProps.input.value || [];

        this.setState({ file: files });
    }
    onDrop(files) {
        this.setState({
            file: files[0]
        });
        this.props.select && this.props.select(files[0]);
    }

    cancelImg() {
        this.setState({file: null});
        this.props.select && this.props.select(null);
    }

    render() {
        console.log(this.state.file);
        const children = this.props;
        console.log(children);
        return (
            <div>
                <Dropzone style={styles.container} onDrop={this.onDrop.bind(this)}>
                    <img style={styles.img}
                         src={this.state.file ? this.state.file.preview : "https://elovequotes.com/assets/images/default-thumbnail.jpg"}/>
                    {this.state.file && <FloatingActionButton onTouchTap={() => {
                        this.cancelImg()
                    }} mini={true} secondary={true} style={styles.iconCancel}>
                        <ContentCancel/>
                    </FloatingActionButton>}
                    {!this.state.file && <div style={styles.blur}><p>select image</p></div>}
                </Dropzone>
            </div>
        );
    }
}

Accept.propTypes = ImageInput.propTypes;

Accept.defaultProps = ImageInput.defaultProps;

export default Accept