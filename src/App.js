/* eslint-disable jsx-a11y/img-redundant-alt */
import {useState, useEffect} from "react"
import nasa from "./nasa.png"
import { key } from "./utils/constants";
import "./index.css"
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import moment from "moment/moment";
import Modal from 'react-modal';

Modal.setAppElement=('#main')
function App() {
  const [latestReport, setLatestReport] = useState({})
  const [prevData, setPrevData] = useState([])
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState();
  const [isLoading, setLoading]= useState(true)
  const [zIndex, setZIndex ] = useState(1)
  
  useEffect(()=>{
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    setLoading(true)
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${key}&date=2023-02-01&hd=true`, requestOptions)
  .then(response => response.text())
  .then(result => {
    setLoading(false)
    const res = JSON.parse(result)
    setLatestReport(res)
  })
  .catch(error => {
    console.log(error,"err")
    setLoading(false)
  });
  },[])


  const loadPrevData = async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      const newStartDate = moment(startDate).subtract(8, 'days').format('YYYY-MM-DD');
      const newEndDate = moment(endDate).subtract(8, 'days').format('YYYY-MM-DD');
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${key}&start_date=${newStartDate}&end_date=${newEndDate}&thumbs=true`);
      const newData = await response.json();
      const tempData = prevData
      tempData.push([...newData])
      // const setArray = new Set(tempData.map(x => JSON.stringify(x)))
      // const uniqArray = [...setArray].map(x => JSON.parse(x));
        setPrevData(tempData);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', loadPrevData);
    return () => {
      window.removeEventListener('scroll', loadPrevData);
    };
  });

  
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1
    }
  };

  function handleModal(data){
    setIsOpen(true)
    setZIndex(-1)
    setModalData(data)
  }
  function handleClose(){
    setIsOpen(false)
    setZIndex(1)
  }

  const customStyles = {
    
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      position: "absolute",
  zIndex: 15,
  paddingTop: "100px",
  width: "100%",
  height: "100%",
  overflow: "auto",
  backgroundColor:" rgba(0,0,0,0.9)"

  };
  return (
    <div className="App" id="main" style={{background:"antiquewhite"}}>
      <header className="App-header">
        <nav className="flex grid-cols-2 bg-black text-center text-white">
          <div className="">
            <img
              src={nasa}
              className="App-logo"
              alt="logo"
              width="100px"
              height="auto"
            />
            <p>Sandeep Varma</p>
          </div>
          <div className="w-[100%]">
            {/* nasa image of the day */}
            <img
              src={latestReport.url}
              alt="nasa-image-of-the-day"
              style={{ objectFit: "cover", width: "100%", height: "100px" }}
            ></img>
          </div>
        </nav>
      </header>

      {/* spolight */}
      {isLoading && <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
        ...
      </svg>}
    <h1 className="text-xl bold text-green mt-15 ml-15">SpotLight of the Day</h1>
      <div className="spotlight">
        <div className="max-w-sm w-full sm:block lg:flex md:flex md:max-w-full lg:max-w-full justify-center mt-10 ">
          <div className="border-l border-b border-l border-gray-400 lg:border-l-1 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal md:w-[35%] lg:w-[35%] sm:w-[100%]">
            <div className="mb-8">
              <h1 className="text-sm text-gray-600 md:flex lg:flex items-center font-bold text-lg">
                {latestReport?.title}
              </h1>
              <p className="text-gray-700 text-base">
                {latestReport?.explanation}
              </p>
            </div>
            <div className="flex items-center">
              <div className="text-sm">
                <p className="text-gray-900 leading-none font-bold text-lg">{latestReport.copyright}</p>
                <p className="text-gray-600">{latestReport.date}</p>
              </div>
            </div>
          </div>
          <div
            className="h-48 md:w-[50%] sm:w-[100%] lg:w-[50%] sm:block md: flex lg:flex bg-cover rounded-t rounded-t-none rounded-l text-center overflow-hidden"
            title="Woman holding a mug"
            style={{ height: "auto", objectFit:"cover"}}
          >
            <img src={latestReport.url} alt="latestreport"></img>
          </div>
        </div>
      </div>

      {/* previous items */}
      <div className="relative" style={{zIndex: zIndex}}>
      {prevData.map((eachArr,index)=>(
        <div key={index+"a"}  style={{ margin:"45px 80px"}}>
        <Carousel
    slidesToSlide={5}
    arrows={true}
    showDots={false}
    responsive={responsive}
    infinite={true}
    autoPlaySpeed={1000}
    keyBoardControl={true}
    customTransition="all .5"
    transitionDuration={500}
    containerClass="carousel-container"
    removeArrowOnDeviceType={["tablet", "mobile"]}
    dotListClass="custom-dot-list-style"
    focusOnSelect={true}
    style={{zIndex:"1"}}
  >
      {eachArr?.map((val,ind)=>(
        <div>
        <div key={ind+val} className="flex justify-center">
            <img key={ind} onClick={()=>{handleModal(val)}} width={250} height={250}  src={eachArr[ind]?.url} alt="img" style={{maxHeight:"150px", objectFit:"cover"}}></img>
        </div>
        <p className="flex justify-center bold text-grey text-lg">{val?.copyright}-{val?.date}</p>
        </div>
      ))}
        </Carousel>
      </div>
      ))} 
      </div>
      <Modal isOpen={isOpen}  style={customStyles} >
        <div className="spotlight" style={{background:"bisque", padding:"2%"}}>
          <h1 className="float-left text-xl text-black-800 md:flex lg:flex items-left font-bold ">{modalData?.title}</h1>
      <button className="float-right" onClick={()=>{handleClose()}}>X</button>
      <div className="max-w-sm w-full sm:block lg:flex md:flex md:max-w-full lg:max-w-full justify-center mt-10 ">
          <div className="border-l border-b border-l border-gray-400 lg:border-l-1 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal md:w-[35%] lg:w-[35%] sm:w-[100%]" style={{background:"antiquewhite"}}>
            <div className="mb-8">
              <h1 className="text-sm text-gray-600 md:flex lg:flex items-center font-bold text-lg">
                {modalData?.title}
              </h1>
              <p className="text-gray-700 text-base">
                {modalData?.explanation}
              </p>
            </div>
            <div className="flex items-center">
              <div className="text-sm">
                <p className="text-gray-900 leading-none font-bold text-lg">{modalData?.copyright}</p>
                <p className="text-gray-600">{modalData?.date}</p>
              </div>
            </div>
          </div>
          <div
            className="h-48 md:w-[50%] sm:w-[100%] lg:w-[50%] sm:block md: flex lg:flex bg-cover rounded-t rounded-t-none rounded-l text-center overflow-hidden"
            title="Woman holding a mug"
            style={{ height: "auto", objectFit:"cover"}}
          >
            <img src={modalData?.url} alt="latestreport"></img>
          </div>
        </div>      </div>
      </Modal>
      </div>
  );
}

export default App;
