/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import nasa from "./nasa.png";
import { key } from "./utils/constants";
import "./index.css";
import "react-multi-carousel/lib/styles.css";
import moment from "moment/moment";
import { Carousel } from "@mantine/carousel";
import { Card, Group, Image, Text, Modal } from "@mantine/core";

Modal.setAppElement = "#main";
function App() {
  const [latestReport, setLatestReport] = useState({});
  const [prevData, setPrevData] = useState([]);
  const [startDate, setStartDate] = useState(
    moment().subtract(7, "days").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState();
  const [isLoading, setLoading] = useState(true);
  const [zIndex, setZIndex] = useState(1);
  const autoplay = useRef(Autoplay({ delay: 1000 }));

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    setLoading(true);
    fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${key}&date=2023-02-01&hd=true`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        setLoading(false);
        const res = JSON.parse(result);
        setLatestReport(res);
      })
      .catch((error) => {
        console.log(error, "err");
        setLoading(false);
      });
  }, []);

  const loadPrevData = async () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 10
    ) {
      const newStartDate = moment(startDate)
        .subtract(8, "days")
        .format("YYYY-MM-DD");
      const newEndDate = moment(endDate)
        .subtract(8, "days")
        .format("YYYY-MM-DD");
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${key}&start_date=${newStartDate}&end_date=${newEndDate}&thumbs=true`
      );
      const newData = await response.json();
      const tempData = prevData;
      tempData.push([...newData]);
      // const setArray = new Set(tempData.map(x => JSON.stringify(x)))
      // const uniqArray = [...setArray].map(x => JSON.parse(x));
      setPrevData(tempData);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", loadPrevData);
    return () => {
      window.removeEventListener("scroll", loadPrevData);
    };
  });

  function handleModal(data) {
    setIsOpen(true);
    setZIndex(-1);
    setModalData(data);
  }
  function handleClose() {
    setIsOpen(false);
    setZIndex(1);
  }

  return (
    <div className="App" id="main">
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
      {isLoading && (
        <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          ...
        </svg>
      )}
      <Text className="text-xl bold text-green mt-15 ml-15">
        SpotLight of the Day
      </Text>
      <div className="spotlight flex justify-center">
        <Card
          withBorder
          shadow="sm"
          radius="md"
          className="w-[80%] m-[5%] max-w-sm w-full sm:block lg:flex md:flex md:max-w-full lg:max-w-full justify-center mt-10"
        >
          <div className="lg:flex md:flex max-h-[45%] sm:block w-[100%]">
            <div className="lg:w-[45%] md:w-[45%]  sm:w-[100%] ml-[2%] mr-[2%]">
              <Card.Section
                withBorder
                inheritPadding
                py="xs"
                className="!block"
              >
                <Group position="apart">
                  <Text weight={500}>{latestReport?.title}</Text>
                </Group>
              </Card.Section>
              <Text className="w-[95%] lg:h-[30%] md:h-[30%] sm:max-h-[25%]">
                {latestReport?.explanation}
              </Text>
            </div>
            <div className="lg:w-[45%] lg:h-[570px] md:w-[45%] md-h-[500px] sm:w-[100%]">
              <Image className="" src={latestReport?.url}></Image>
            </div>
          </div>
        </Card>
      </div>

      {/* previous items */}
      <div className="relative" style={{ zIndex: zIndex }}>
        {prevData.map((eachArr, index) => (
          <div key={index + "a"} style={{ margin: "45px 80px" }}>
            <Carousel
              withIndicators
              height={200}
              slideSize="33.333333%"
              slideGap="md"
              loop
              align="start"
              breakpoints={[
                { maxWidth: "md", slideSize: "50%" },
                { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
              ]}
              plugins={[autoplay.current]}
              onMouseEnter={autoplay.current.stop}
              onMouseLeave={autoplay.current.reset}
              style={{ zIndex: "1" }}
              className="bg-green shadow-lg shadow-black-500/50"
            >
              {eachArr?.map((val, ind) => (
                <Carousel.Slide>
                  <Card
                    onClick={() => {
                      handleModal(val);
                    }}
                  >
                    <Card.Section>
                      <Image
                        src={eachArr[ind]?.url}
                        height={160}
                        alt="space image"
                      ></Image>
                    </Card.Section>
                    <Text size="sm" color="dimmed">
                      {eachArr[ind]?.copyright || "anonymous"}
                    </Text>
                  </Card>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        ))}
      </div>
      <Modal
        opened={isOpen}
        onClose={() => {
          handleClose();
        }}
        withCloseButton={true}
        title={modalData?.title}
        size="70%"
      >
        <div className="spotlight flex justify-center">
          <Card
            withBorder
            shadow="sm"
            radius="md"
            className="w-[100%] w-full sm:flex lg:flex md:flex md:max-w-full lg:max-w-full justify-center"
          >
            <div className="lg:flex md:flex max-h-[45%] sm:flex w-[100%]">
              <div className="lg:w-[100%] md:w-[100%]  sm:w-[100%] ml-[2%] mr-[2%]">
                <Card.Section
                  withBorder
                  inheritPadding
                  py="xs"
                  className="!block"
                >
                  <Group position="apart">
                    <Text weight={500}>{modalData?.title}</Text>
                  </Group>
                </Card.Section>
                <Text className="w-[95%] lg:h-[30%] md:h-[30%] sm:max-h-[25%]">
                  {modalData?.explanation}
                </Text>
              </div>
              <div className="lg:w-[45%] lg:h-[570px] md:w-[45%] md-h-[500px] sm:w-[50%]">
                <Image className="" src={modalData?.url}></Image>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
}

export default App;
