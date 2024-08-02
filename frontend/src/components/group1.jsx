import React from 'react';
import '../styles/group1.css';

const Group1 = () => {
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
              <input type="range" min="1" max="6" defaultValue="3" className="slider" id="myRange1" />
            </div>
            <span className="font text_6">口感</span>
            <div className="slidecontainer2">
              <input type="range" min="1" max="6" defaultValue="3" className="slider" id="myRange2" />
            </div>
            <span className="font text_8">奶香</span>
            <div className="slidecontainer3">
              <input type="range" min="1" max="6" defaultValue="3" className="slider" id="myRange3" />
            </div>
          </div>
          <div className="flex-col section_4">
            <span className="self-start font_2 text_4">热量</span>
            <span className="self-center font text_7 mt-108">卡路里</span>
          </div>
        </div>
        <div className="flex-row mt-17">
          <div className="flex-col shrink-0 section_5">
            <div className="flex-row items-center group_2">
              <span className="font_2">食谱</span>
              <span className="font_2 text_9 ml-299">修改</span>
            </div>
            <div className="divider"></div>
            <div className="flex-row items-center group_3">
              <span className="font_3 text_11">食 材</span>
              <span className="font_3 text_12 ml-223">用 量/g</span>
            </div>
            <div className="divider"></div>
            <div className="flex-row items-center group_4">
              <span className="font_3 text_14">黄 油</span>
              <span className="font_4 text_16 ml-236">1 1 0</span>
            </div>
            <div className="divider_2"></div>
            <div className="flex-row items-center group_5">
              <span className="font_3 text_18">细 砂 糖</span>
              <span className="font_4 text_19 ml-230">8 0</span>
            </div>
            <div className="divider_2"></div>
            <div className="flex-row items-center group_6">
              <span className="font_3 text_21">蛋白液</span>
              <span className="font_4 ml-236">25</span>
            </div>
            <div className="divider"></div>
            <div className="flex-row items-center group_7">
              <span className="font_3 text_23">低筋面粉</span>
              <span className="font_4 ml-226">185</span>
            </div>
            <div className="divider"></div>
            <div className="flex-row items-center group_8">
              <span className="font_3 text_26">蔓越莓干</span>
              <span className="font_4 ml-230">55</span>
            </div>
            <div className="divider"></div>
            <div className="flex-row items-center group_9">
              <span className="font text_28">总计</span>
              <span className="font_4 ml-244">455</span>
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