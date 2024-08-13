import React, {useState, useEffect}from 'react';
import '../styles/group1.css';
import image from '../assets/default.jpg';

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
  const caloriePerGram = 100 * parseFloat((outputCalorie/sum).toFixed(2));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userChangeTaste, setUserTaste] = useState(false);
  const [userChangeAmount, setUserAmount] = useState(false);


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
    setUserAmount(true);
  };
  const handleSugarChange = (e) => {
    setInputSugar(parseFloat(e.target.value));
    setUserAmount(true);
  };
  const handleOilDecrement = () => {
    setInputOil(prevOil => Math.max(prevOil - 1, 0));
    setUserAmount(true);
  };
  const handleOilIncrement = () => {
    setInputOil(prevOil => prevOil + 1);
    setUserAmount(true);
  };

  const handleSugarDecrement = () => {
    setInputSugar(prevSugar => Math.max(prevSugar - 1, 0));
    setUserAmount(true);
  };
  const handleSugarIncrement = () => {
    setInputSugar(prevSugar => prevSugar + 1);
    setUserAmount(true);
  };

  useEffect(() => {
    if (!userChangeAmount) return;
    async function fetchData() {
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

      const result = await response.json();

      getResults(result);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
    }
    fetchData();
    setUserAmount(false);
  }, [inputOil, inputSugar, userChangeAmount]);

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
			<div className="flex-col">
				<div className="flex-row justify-between">
					<div className="flex-row items-center relative section">
						<span className="text">BaKing</span>
						<div className="shrink-0 section_3 view"></div>
						<span className="font text_2">蔓越莓饼干</span>
						<div className="shrink-0 section_3 view_2"></div>
						<span className="font text_3">用户01</span>
					</div>
					<div className="flex-row section_2">
						<div className="section_3 view_3"></div>
						<div className="ml-96 section_3"></div>
						<div className="ml-96 section_3"></div>
					</div>
				</div>
				<div className="flex-row group">
					<span className="font_2 text_4">预期成果</span>
					<div className="flex-row ml-280">
						<span className="font_2 text_5">推荐用量（克）</span>
						<span className="font_2 text_6 ml-175">口味调整</span>
					</div>
				</div>
				<div className="flex-row justify-center group_2">
					<div className="flex-col justify-start items-center relative image-wrapper">
						<img className="image"
							src={image} alt="Predicted Outcome"/>
					</div>
					<div className="flex-col relative section_4 ml-19">
						<div className="flex-row items-baseline self-stretch">
							<span className="font_3 text_7">黄油</span>
							<div className="selector_1">
								<div>
									<button onClick={handleOilDecrement}>-</button>
									<input type="number" id="quantity1" class="value" value={inputOil} onChange={handleOilChange}/>
									<button onClick={handleOilIncrement}>+</button>
								</div>
							</div>
							<span className="font_4 text_8 ml-119">左右</span>
						</div>
						<div className="mt-24 flex-row items-baseline self-stretch">
							<span className="font_5 text_10">细砂糖</span>
							<div className="selector_2">
								<div>
									<button onClick={handleSugarDecrement}>-</button>
									<input type="number" id="quantity2" class="value" value={inputSugar} onChange={handleSugarChange}/>
									<button onClick={handleSugarIncrement}>+</button>
								</div>
							</div>
							<span className="font_4 text_11 ml-120">上限</span>
						</div>
						<div className="mt-24 flex-row items-baseline self-stretch">
							<span className="font_5 text_35">蛋白液</span>
							<div className="selector_3">
								<div>
									<span id="quantity3" className="value">{outputLiquid}</span>
								</div>
							</div>
							<span className="font_4 text_12 ml-120">下限</span>
						</div>
						<div className="mt-24 flex-row items-baseline self-stretch">
							<span className="font_3 text_14">低筋面粉</span>
							<div className="selector_4">
								<div>
									<span id="quantity4" class="value">{outputFlour}</span>
								</div>
							</div>
							<span className="font_4 text_17 ml-120">上限</span>
						</div>
						<div className="mt-24 flex-row items-baseline self-stretch">
							<span className="font_3 text_18">蔓越莓干</span>
							<div className="selector_5">
								<div>
									<span id="quantity5" className="value">{outputBerry}</span>
								</div>
							</div>
							<span className="font_4 text_19 ml-119">左右</span>
						</div>
						<span className="mt-24 self-start font_2 text_21">总计</span>
						<div className="total">
							<span id="sum" className="text_34">{sum}</span>
						</div>
					</div>
					<div className="flex-col section_5 ml-19">
						<div className="flex-col">
							<span className="self-start font_4 text_9">甜度</span>
							<div className="slidecontainer1">
								<input type="range" min="1" max="6" value={sweetnessValue} className="slider" id="myRange" onChange={(e) => handleTasteChange(e, setSweetnessValue)}/>
							</div>
							<div className="flex-row self-stretch group_3 mt-17">
								<span className="font_4 text_31">淡</span>
								<span className="font_4 ml-339 text_32">甜</span>
							</div>
						</div>
						<div className="mt-44 flex-col">
							<span className="self-start font_4 text_13">口感</span>
							<div className="slidecontainer2">
								<input type="range" min="1" max="6" value={textureValue} class="slider" id="myRange" onChange={(e) => handleTasteChange(e, setTextureValue)}/>
							</div>
							<div className="flex-row self-stretch group_4 mt-17">
								<span className="font_4 text_15">脆硬</span>
								<span className="font_4 text_16 ml-306">酥松</span>
							</div>
						</div>
						<div className="mt-44 flex-col">
							<span className="self-start font_4 text_20">奶香</span>
							<div className="slidecontainer3">
								<input type="range" min="1" max="6" value={milkinessValue} class="slider" id="myRange" onChange={(e) => handleTasteChange(e, setMilkinessValue)}/>
							</div>
							<div className="flex-row self-stretch group_3 mt-17">
								<span className="font_4 text_33">淡</span>
								<span className="font_4 text_22 ml-339">浓</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-30 flex-col">
				<div className="flex-row justify-between">
					<span className="font_2 text_23">制作步骤</span>
					<span className="font_2 text_24">预估热量</span>
				</div>
				<div className="flex-row mt-15">
					<div className="flex-col items-start flex-1 relative section_6">
						<span className="font_3 text_25">软化黄油，在黄油中加入细砂糖，搅打至黄油微微发白，得到糖油混合物。</span>
						<span className="font_3 text_26 mt-23">在糖油混合物中加入蛋白液，搅打至完全乳化，得到混合物（A）。</span>
						<span className="font_3 text_28 mt-23">
							切碎蔓越莓干，将蔓越莓干碎加入低筋面粉，充分搅拌，得到混合物（B）。
						</span>
						<span className="font_3 text_29 mt-23">将（A）和（B）充分混合得到面团，将面团放入铺有保鲜膜的模具塑形。</span>
						<span className="font_3 mt-23">将塑形后的面团放到冰箱中冷冻30分钟，面团变硬后取出，切成约0.5厘米的薄片。</span>
						<span className="font_3 mt-23">烤箱预热，上火160度，下火150度，烘烤约20分钟后取出，静置冷却。</span>
					</div>
					<div className="flex-col items-center shrink-0 section_7 ml-19">
						<span className="text_27">{caloriePerGram}</span>
						<span className="font_3 text_30 mt-31">卡路里/100克</span>
					</div>
				</div>
			</div>
		</div>
  );
};

export default Group1;