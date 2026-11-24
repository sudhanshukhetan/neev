import React from 'react';
import { useNeevStore } from '../../store/useNeevStore.js';

export default class SceneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.warn('[neev] 3D scene error caught:', error.message);
    // Switch to 2D mode
    useNeevStore.getState().setMode('2d');
    useNeevStore.getState().showToast('3D unavailable — switched to 2D Blueprint Mode.');
  }

  componentDidMount() {
    // Listen for WebGL context lost
    this._handleContextLost = (e) => {
      e.preventDefault();
      useNeevStore.getState().setMode('2d');
      useNeevStore.getState().showToast('3D unavailable — switched to 2D Blueprint Mode.');
    };
    window.addEventListener('webglcontextlost', this._handleContextLost);
  }

  componentWillUnmount() {
    window.removeEventListener('webglcontextlost', this._handleContextLost);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-paper">
          <div className="font-mono text-xs text-muted opacity-60 italic text-center px-4">
            3D rendering unavailable. Using 2D blueprint mode.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
