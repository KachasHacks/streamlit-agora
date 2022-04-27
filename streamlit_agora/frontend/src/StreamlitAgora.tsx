import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"
import { LightTheme, DarkTheme, ThemeProvider } from 'baseui';
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import {FlexGrid, FlexGridItem} from 'baseui/flex-grid';
import AgoraUIKit, { PropsInterface } from 'agora-react-uikit'

interface State {
  room: string
  userName: string
  videocall: boolean
}

/**
 * This is a React-based component template. The `render()` function is called
 * automatically when your component should be re-rendered.
 */
class StreamlitAgora extends StreamlitComponentBase<State> {
  public state = { userName: '', videocall: false, room: ''}

  //componentDidUpdate(){
    //Streamlit.setFrameHeight(800)
  //}

  public render = (): ReactNode => {
    // Arguments that are passed to the plugin in Python are accessible
    // via `this.props.args`. Here, we access the "name" arg.
    const appId = this.props.args["app_id"]

    const { theme } = this.props

    const props: PropsInterface = {
      rtcProps: {
      appId: appId,
      channel: this.state.room,
      token: null, // pass in channel token if the app is in secure mode
      //uid: this.state.userName,
    },
    callbacks: {
      EndCall: () => this.setState({ videocall: false })
    },
    styleProps: {
      localBtnContainer: {backgroundColor: theme?.secondaryBackgroundColor, borderRadius: "0 0 10px 10px"}
    }
    }

    // Streamlit sends us a theme object via props that we can use to ensure
    // that our component has visuals that match the active theme in a
    // streamlit app.
    const style: React.CSSProperties = {}
    let currentTheme = LightTheme

    const styles = {
      container: { width: '100%', height: '500px', display: 'flex', flex: 1},
    }

    // Maintain compatibility with older versions of Streamlit that don't send
    // a theme object.
    if (theme) {
      // Use the theme object to style our button border. Alternatively, the
      // theme style is defined in CSS vars.
      const borderStyling = `1px solid ${
        theme.primaryColor 
      }`
      //style.border = borderStyling
      style.outline = borderStyling
      currentTheme = theme.base === 'light' ? LightTheme : DarkTheme 
    }

    // Show a button and some text.
    // When the button is clicked, we'll increment our "numClicks" state
    // variable, and send its new value back to Streamlit, where it'll
    // be available to the Python program.
    return (
      <ThemeProvider theme={currentTheme}>
          {this.state.videocall ? (
            <div style={styles.container}>
              <AgoraUIKit
                rtcProps={props.rtcProps}
                callbacks={props.callbacks}
                styleProps={props.styleProps} />
            </div>
          ) : (
            <div style={{ width: "100%" }}>
              <p>Agora</p>
              <FlexGrid
                flexGridColumnCount={1}
                flexGridRowGap="scale800"
              >
                <FlexGridItem>
                  <Input
                    value={this.state.room}
                    onChange={e => this.setState({ room: e.currentTarget.value })}
                    placeholder="Enter room name"
                    clearOnEscape
                    overrides={{
                      Root: {
                        style: ({ $theme }) => ({
                          borderRadius: "5px",
                          backgroundColor: "gray"
                        })
                      }
                    }}
                  />
                </FlexGridItem>
                <FlexGridItem>
                  <Input
                    value={this.state.userName}
                    onChange={e => this.setState({ userName: e.currentTarget.value })}
                    placeholder="Enter your name"
                    clearOnEscape
                    overrides={{
                      Root: {
                        style: ({ $theme }) => ({
                          borderRadius: "5px"
                        })
                      }
                    }}
                  />
                </FlexGridItem>
                <FlexGridItem>
                  <Button onClick={()=>this.onClicked()}>Start Call</Button>
                </FlexGridItem>
              </FlexGrid>

            </div>
          )}
      </ThemeProvider>
    )
  }

  private onClicked = (): void => {
    this.setState({ videocall: !this.state.videocall })
    Streamlit.setComponentValue(this.state.room)
  }

}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(StreamlitAgora)
