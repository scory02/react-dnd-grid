import Content from './components/Content';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './styles/App.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

function App() {
  return (
    <div className='App'>
      <DndProvider backend={HTML5Backend}>
        <Content />
      </DndProvider>
    </div>
  );
}

export default App;