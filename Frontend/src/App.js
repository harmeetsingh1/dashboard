import { Route, BrowserRouter as Router , Routes} from 'react-router-dom';
import './App.css';
import Menu from './Components/Menu';
import Question from './Components/Question';
import CSVUploader from './Components/CSVUploader';
import LeadWindow from './Components/LeadWindow';
import LogIn from './Components/LogIn';
import SignUp from './Components/SignUp';



function App() {
  return (
    <div className="App">
       <Menu/>
     
        <Routes>
        <Route path='/' element={<Menu/>}/>
         {/* <Route path='/question' element={<Question/>}/> */}
         <Route path='/upload' element={<CSVUploader/>}/>
         <Route path='/leads' element={<LeadWindow/>}/>
         <Route path='/login' element={<LogIn/>}/>
         <Route path='/signup' element={<SignUp/>}/>

       </Routes>
       
    </div>
  );
}

export default App;
