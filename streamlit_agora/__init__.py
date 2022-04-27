import os
import streamlit.components.v1 as components

_RELEASE = True


if not _RELEASE:
    _component_func = components.declare_component(
        "streamlit_agora",
        url="http://localhost:3001",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("streamlit_agora" , path=build_dir)


def streamlit_agora(app_id, token_url=None, key=None):
    """Create a new instance of "streamlit_agora".

    Parameters
    ----------
    app_id: str
        The Agora app ID that can be gotten from your Agora dashboard
    token_url: str or None
        The URL of the token api that provides Agora tokens used for requests 
        in production. 
    key: str or None
        An optional key that uniquely identifies this component. If this is
        None, and the component's arguments are changed, the component will
        be re-mounted in the Streamlit frontend and lose its current state.

    Returns
    -------
    str
        The name of the room that the user creates.

    """
    component_value = _component_func(app_id=app_id, token_url=token_url, key=key, default="")

    return component_value


if not _RELEASE:
    import streamlit as st

    st.subheader("Component with constant args")
    st.text_input("Enter me")

    room_name = streamlit_agora("<AGORA APP ID")
    st.markdown("Room Name: %s" % room_name)

