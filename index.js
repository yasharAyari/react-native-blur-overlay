import {View, Platform, NativeModules, requireNativeComponent, StyleSheet, TouchableWithoutFeedback,Animated} from 'react-native';
import React, {Component} from 'react';

const {SajjadBlurOverlay} = NativeModules;
var iface = {
    name: 'BlurView',
};
var RCTSajjadBlurOverlay = Platform.select({
  ios: () => requireNativeComponent('SajjadBlurOverlay', iface),
  android: () => requireNativeComponent('RCTSajjadBlurOverlay', iface),
})();
export default class BlurOverlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          showBlurOverlay: false,
          fadeIn: new Animated.Value(0),
        }
        this.ref = this;
    }

    openOverlay() {
        this.setState({
            showBlurOverlay: true,
            fadeIn: new Animated.Value(0),
        }, () => {
            Animated.parallel([
                Animated.timing(
                    this.state.fadeIn,
                    {
                        toValue: 1,
                        duration: 500,
                    }
                )
            ]).start();
        })
    }

    closeOverlay() {
        Animated.parallel([
            Animated.timing(
                this.state.fadeIn,
                {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true
                }
            )
        ]).start(()=>this.setState({showBlurOverlay: false}));
    
    }

    render() {
        const { children } = this.props;
        return (
            this.state.showBlurOverlay ?
            <Animated.View style={[ {opacity: this.state.fadeIn},styles.style]}>
            <TouchableWithoutFeedback style={styles.style} onPress={this.props.onPress}>
                <RCTSajjadBlurOverlay {...this.props} style={[this.props.customStyles,styles.style]}>
                <View style={[this.props.customStyles,styles.style]}>
                {children}

                </View>
                </RCTSajjadBlurOverlay>
            </TouchableWithoutFeedback>
            </Animated.View> :
                null
        );
    }
}


const styles = StyleSheet.create({
    style: {
        position: 'absolute',
        flex: 1,
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        //  resizeMode: 'cover',
        width: null,
        height: null,
        zIndex: 999,
    },
});
//export default SajjadBlurOverlay;
//module.exports = requireNativeComponent('RCTSajjadBlurOverlay', iface);
