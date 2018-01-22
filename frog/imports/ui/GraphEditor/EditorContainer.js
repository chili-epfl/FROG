import React, {Component} from 'react';
import styled from 'styled-components';

import {connect} from './store';
import Graph from './Graph';
import {RenameBox} from './Rename';
import SidePanel from './SidePanel';
import HelpModal from './HelpModal';
import TopPanel from './TopPanel';
import ExpandButton from './SidePanel/ExpandButton';
import Preview from '../Preview/Preview';
import TopBar from '../App/TopBar';
const styles = {
    sheet: {
        background: "white",
    }
};
const EditorPanel = () => (
    <div className="bootstrap" style={styles.sheet}>
        <ExpandButton/>
        <div style={{height: 600}}>
            <Graph scaled hasTimescale isEditable/>
        </div>
        <RenameBox/>
        <div style={{height: 150}}>
            <Graph hasPanMap/>
        </div>
        <HelpModal/>
    </div>
    <RenameBox />
    <div className="bootstrap" style={{ height: 150 }}>
      <Graph hasPanMap />
    </div>
    <HelpModal />
  </div>
);

class Editor extends Component {
    componentDidMount() {
        window.addEventListener('resize', this.props.store.ui.updateWindow);
        this.props.store.ui.updateWindow();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.props.store.ui.updateWindow);
    }

    render() {
        if (this.props.store.ui.showPreview) {
            return (
                <Preview
                    activityTypeId={this.props.store.ui.showPreview.activityTypeId}
                    config={this.props.store.ui.showPreview.config}
                    dismiss={() => this.props.store.ui.setShowPreview(false)}
                />
            );
        }
        const styles = {
            gridContent: {
                marginLeft: 0,
                display: 'flex',
                flexDirection: 'column'
            },
            subroot: {
                paddingTop: 48,
                paddingRight: 3,
                paddingLeft: 3
            },
            main: {
                height: 760,
                flex: 30,
                overflow: "hidden",
            },
            container: {
                height: "95%",
                display: "flex",
                flexDirection: "row"
            }
        };
        return (
            <div style={styles.subroot}>
                <TopBar barHeight={styles.subroot.paddingTop}/>
                <div style={styles.gridContent}>
                    <TopPanel/>
                    <div style={styles.container}>
                        <div style={styles.main}>
                            <EditorPanel />
                        </div>
                        <SidePanel />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(Editor);
