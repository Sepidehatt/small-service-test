import './App.css';
import data from './data.csv'
import { useState, useEffect } from 'react'
import { csv } from 'd3';
import ebike from './ebike.png'



function App() {
  const [infos, setInfos] = useState([])


  //😎 1-convert csv file to array of objects with D3 npm Package:
  // useEffect(() => {
  //   csv(data).then(setInfos)
  // }, [])


  //2-convert csv file to array of objects manually:

  useEffect(() => {
    getData()
  }, [])

  async function getData() {

    let arrOfObj = []
    //getting csv data and change it to plain text
    const response = await fetch(data)
    const textData = await response.text()

    let lines = textData.split('\n')
    let header = lines[0].split(',')
    for (let i = 1; i < lines.length; i++) {
      let rowData = lines[i].split(',')
      arrOfObj[i] = {}
      rowData?.forEach((elm, j) => arrOfObj[i][header[j]] = rowData[j])
    }
    return setInfos(arrOfObj)
  }


// -----------------------------

  //add all models in an array and remove all space and special characters from each models
  const modelsArr = infos?.map(elm => elm.Model.trim().toLowerCase())
    .map(elm => elm.split(/[ -.:;?!~`"&|()<>{}[\]\r\n/\\]+/).join(''))

  //counting how much a model repeat in our models array
  const counts = {}
  let sortedModels = []
  modelsArr.forEach(model => counts[model] = (counts[model] || 0) + 1);
  //sort models by most popular models
  for (let model in counts) {
    sortedModels.push([model, counts[model]])
  }
  // save top 3 models in a variable
  let topThree = sortedModels.sort((a, b) => b[1] - a[1]).slice(0, 3)



  return (
    <div className="App">
      <div className='wrapper'>
        <h1>Top 3 Models in BikEEE:</h1>
        <div className='container'>
          {topThree.map((model, i) => {
            //get full information of each models to display extra details 
            const fullInfo = infos?.find(elm => elm?.Model.toLowerCase().split(/[ -.:;?!~,`"&|()<>{}[\]\r\n/\\]+/).join('') === model[0])
            return (
              <h5>{i + 1} - {fullInfo.Model} designed by {fullInfo.Make}</h5>
            )
          })}
        </div>
      </div>
      <img src={ebike} alt="ebike" />
    </div>
  );
}

export default App;
