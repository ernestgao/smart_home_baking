import React, {useState, useEffect}from 'react';
import '../styles/group1.css';

const Group1 = () => {
  const url = 'https://really-touching-gull.ngrok-free.app';
  const [inputOil, setInputOil] = useState(0);
  const [inputSugar, setInputSugar] = useState(0);
  const [outputLiquid, setOutputLiquid] = useState(0);
  const [outputFlour, setOutputFlour] = useState(0);
  const [outputBerry, setOutputBerry] = useState(0);
  const [sweetnessValue, setSweetnessValue] = useState(1);
  const [textureValue, setTextureValue] = useState(1);
  const [milkinessValue, setMilkinessValue] = useState(1);
  const [outputCalorie, setOutputCalorie] = useState(0);
  const sum = inputOil + inputSugar + outputLiquid + outputFlour + outputBerry;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userChangeTaste, setUserTaste] = useState(false);

  // initialization
  useEffect(() => {
    const apiUrl = url+'/plan/1';
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl, {
          headers: new Headers({
            "ngrok-skip-browser-warning": "69420"
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        getResults(result);
      } catch (error) {
        setError(error.message);
        console.log("error fetch:", error)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //amount part
  const handleOilChange = (e) => {
    setInputOil(parseFloat(e.target.value));
  };
  const handleSugarChange = (e) => {
    setInputSugar(parseFloat(e.target.value));
  };
  const handleModify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url+'/modify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sugar: inputSugar,
          oil: inputOil
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let result = await response.json();

      getResults(result);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // taste part
  useEffect(() => {
    if (!userChangeTaste) return;
    async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url+'/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sweetness: sweetnessValue,
          texture: textureValue,
          milkiness: milkinessValue
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      getResults(result);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
    }
    fetchData();
    setUserTaste(false);
  }, [milkinessValue, sweetnessValue, textureValue, userChangeTaste]);

  const handleTasteChange = async (e, set) => {
    const newValue = parseInt(e.target.value);
    set(newValue);
    setUserTaste(true);
  };

  const getResults = (results) => {
    let result = results.result;
    const extractedAmount = result.amount;
    const extractedTaste = result.tastes;
    const extractedCalorie = result.calorie;

    // Set the amounts
    setInputSugar(extractedAmount.sugar);
    setInputOil(extractedAmount.oil);
    setOutputLiquid(extractedAmount.liquid);
    setOutputFlour(extractedAmount.flour);
    setOutputBerry(extractedAmount.berry);
    // Set the tastes
    setSweetnessValue(extractedTaste.sweetness);
    setTextureValue(extractedTaste.texture);
    setMilkinessValue(extractedTaste.milkiness);
    // Set the calorie
    setOutputCalorie(extractedCalorie);
  };

  return (
    <div className="flex-col page">
      <div className="flex-row justify-center items-center self-start section">
        <div className="section_2 view"></div>
        <span className="font text ml-7">蔓越莓饼干</span>
        <div className="section_2 view_2 ml-7"></div>
      </div>
      <div className="flex-col self-stretch group">
        <div className="flex-row">
          <div className="flex-col justify-start items-start text-wrapper">
            <span className="font_2 text_2">我的饼干</span>
          </div>
          <div className="flex-col items-start section_3">
            <span className="font_2 text_3">口味</span>
            <span className="font text_5">甜度</span>
            <div className="slidecontainer1">
              <input type="range" min="1" max="6" value={sweetnessValue} className="slider" id="myRange1" onChange={(e) => handleTasteChange(e, setSweetnessValue)}/>
            </div>
            <span className="font text_6">口感</span>
            <div className="slidecontainer2">
              <input type="range" min="1" max="6" value={textureValue} className="slider" id="myRange2" onChange={(e) => handleTasteChange(e, setTextureValue)}/>
            </div>
            <span className="font text_8">奶香</span>
            <div className="slidecontainer3">
              <input type="range" min="1" max="6" value={milkinessValue} className="slider" id="myRange3" onChange={(e) => handleTasteChange(e, setMilkinessValue)}/>
            </div>
          </div>
          <div className="flex-col section_4">
            <span className="self-start font_2 text_4">热量</span>
            <b>{outputCalorie}</b>
            <span className="self-center font text_7 mt-108">卡路里</span>
          </div>
        </div>
        <div className="flex-row mt-17">
          <div className="flex-col shrink-0 section_5">
            <div className="flex-row items-center group_2">
              <span className="font_2">食谱</span>
              <button onClick={handleModify} className="font_2 text_9 ml-299">修改</button>
            </div>
            <div className="divider"></div>
            <div className="flex-row items-center group_3">
              <span className="font_3 text_11">食 材</span>
              <span className="font_3 text_12 ml-223">用 量/g</span>
            </div>
            <div className="divider"></div>
            <div className="flex-row items-center group_4">
              <span className="font_3 text_14">黄 油</span>
              <input type="number" class="font_4 text_16 ml-236" value={inputOil} onChange={handleOilChange}></input>
            </div>
            <div className="divider_2"></div>
            <div className="flex-row items-center group_5">
              <span className="font_3 text_18">细 砂 糖</span>
              <input type="number" className="font_4 text_19 ml-230" value={inputSugar} onChange={handleSugarChange}></input>
            </div>
            <div className="divider_2"></div>
            <div className="flex-row items-center group_6">
              <span className="font_3 text_21">蛋白液</span>
              <span className="font_4 ml-236">{outputLiquid}</span>
            </div>
            <div className="divider"></div>
            <div className="flex-row items-center group_7">
              <span className="font_3 text_23">低筋面粉</span>
              <span className="font_4 ml-226">{outputFlour}</span>
            </div>
            <div className="divider"></div>
            <div className="flex-row items-center group_8">
              <span className="font_3 text_26">蔓越莓干</span>
              <span className="font_4 ml-230">{outputBerry}</span>
            </div>
            <div className="divider"></div>
            <div className="flex-row items-center group_9">
              <span className="font text_28">总计</span>
              <span className="font_4 ml-244">{sum}</span>
            </div>
          </div>
          <div className="flex-col flex-1 section_6 ml-35">
            <div className="flex-row justify-between self-stretch">
              <span className="font_2">制作过程</span>
              <span className="font_2 text_10">用时约XX分钟</span>
            </div>
            <span className="self-start font_3 text_13">1.软化黄油，在黄油中加入细砂糖，搅打至黄油微微变白。</span>
            <span className="self-start font_3 text_15">2.加入蛋白液，搅打至完全乳化。</span>
            <span className="self-start font_3 text_17">3. 加入低筋面粉，充分搅拌。</span>
            <span className="self-start font_3 text_20">4. 蔓越莓干切碎，加入面条。</span>
            <span className="self-start font_3 text_22">5.将面团放入铺有保鲜膜的模具中塑形。</span>
            <span className="self-start font_3 text_24">6. 将模具和面团放至冰箱，冷冻30分钟至面团变硬。</span>
            <span className="self-start font_3 text_25">7.取出面团，切成0.5的片状。</span>
            <span className="self-start font_3 text_27">8.预热烤箱10分钟，烘烤上火160度，下火150度，烘烤约20分钟</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group1;