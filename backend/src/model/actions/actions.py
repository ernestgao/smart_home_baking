# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import UserUtteranceReverted
from rasa_sdk.events import SlotSet

class ActionDefaultFallback(Action):
    def name(self):
        return "action_default_fallback"

    async def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        dispatcher.utter_message(response="utter_default")
        return [UserUtteranceReverted()]
    
class ActionHandleCommand(Action):
    def name(self):
        return "action_handle_command"

    async def run(self, dispatcher: CollectingDispatcher, tracker, domain):

        intent = tracker.latest_message['intent'].get('name')
        response = {
            "is_command": True,   # Flag to identify command responses
            "command": intent,
            "parameters": {},
            "message": ""
        }
        if intent == "设置时长":
            # Get the time slot value extracted from the user input
            time_value = tracker.get_slot("time")
            # Check if time was successfully extracted
            if not time_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["time"] = time_value
            response["message"] = f"好的，已为您设置计时器：{time_value}。"
            dispatcher.utter_message(json_message=response)

        elif intent == "开始计时":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "已开始计时。"
            dispatcher.utter_message(json_message=response)

        elif intent == "暂停计时":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "已暂停计时。"
            dispatcher.utter_message(json_message=response)

        elif intent == "恢复计时":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "已恢复计时。"
            dispatcher.utter_message(json_message=response)

        elif intent == "重置计时":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "已重置计时。"
            dispatcher.utter_message(json_message=response)

        elif intent == "增加计时":
            # Get the time slot value extracted from the user input
            time_value = tracker.get_slot("time")
            # Check if time was successfully extracted
            if not time_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["time"] = time_value
            response["message"] = f"好的，已为您增加：{time_value}。"
            dispatcher.utter_message(json_message=response)

        elif intent == "减少计时":
            # Get the time slot value extracted from the user input
            time_value = tracker.get_slot("time")
            # Check if time was successfully extracted
            if not time_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["time"] = time_value
            response["message"] = f"好的，已为您减少：{time_value}。"
            dispatcher.utter_message(json_message=response)

        elif intent == "去皮":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "秤已归零。"
            dispatcher.utter_message(json_message=response)

        elif intent == "跳转第一个页面":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "跳转至调整食谱页面。"
            dispatcher.utter_message(json_message=response)

        elif intent == "跳转第三个页面":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "跳转至成果评价页面。"
            dispatcher.utter_message(json_message=response)

        elif intent == "回到上一步":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "已返回上一步。"
            dispatcher.utter_message(json_message=response)

        elif intent == "回到下一步":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "已来到下一步。"
            dispatcher.utter_message(json_message=response)

        elif intent == "步骤跳转":
            step_value = tracker.get_slot("step")
            if not step_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["step"] = step_value
            response["message"] = f"好的，已为您跳转第{step_value}。"
            dispatcher.utter_message(json_message=response)

        elif intent == "称量低筋面粉":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "开始称量低筋面粉。"
            dispatcher.utter_message(json_message=response)

        elif intent == "增加低筋面粉":
            weight_value = tracker.get_slot("weight")
            if not weight_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["weight"] = weight_value
            response["message"] = f"好的，已为您增加{weight_value}。"
            dispatcher.utter_message(json_message=response)

        elif intent == "减少低筋面粉":
            weight_value = tracker.get_slot("weight")
            if not weight_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["weight"] = weight_value
            response["message"] = f"好的，已为您减少{weight_value}。"
            dispatcher.utter_message(json_message=response)

        elif intent == "称量黄油":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "开始称量黄油。"
            dispatcher.utter_message(json_message=response)

        elif intent == "增加黄油":
            weight_value = tracker.get_slot("weight")
            if not weight_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["weight"] = weight_value
            response["message"] = f"好的，已为您增加{weight_value}。"
            dispatcher.utter_message(json_message=response)

        elif intent == "减少黄油":
            weight_value = tracker.get_slot("weight")
            if not weight_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["weight"] = weight_value
            response["message"] = f"好的，已为您减少{weight_value}。"
            dispatcher.utter_message(json_message=response)

        elif intent == "称量白砂糖":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "开始称量白砂糖。"
            dispatcher.utter_message(json_message=response) 

        elif intent == "增加白砂糖":
            weight_value = tracker.get_slot("weight")
            if not weight_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["weight"] = weight_value
            response["message"] = f"好的，已为您增加{weight_value}。"
            dispatcher.utter_message(json_message=response)

        elif intent == "减少白砂糖":
            weight_value = tracker.get_slot("weight")
            if not weight_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["weight"] = weight_value
            response["message"] = f"好的，已为您减少{weight_value}。"
            dispatcher.utter_message(json_message=response)       
        
        elif intent == "称量蛋白液":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "开始称量蛋白液。"
            dispatcher.utter_message(json_message=response) 

        elif intent == "增加蛋白液":
            weight_value = tracker.get_slot("weight")
            if not weight_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["weight"] = weight_value
            response["message"] = f"好的，已为您增加{weight_value}。"
            dispatcher.utter_message(json_message=response)

        elif intent == "减少蛋白液":
            weight_value = tracker.get_slot("weight")
            if not weight_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["weight"] = weight_value
            response["message"] = f"好的，已为您减少{weight_value}。"
            dispatcher.utter_message(json_message=response) 

        elif intent == "称量蔓越莓干":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "开始称量蔓越莓干。"
            dispatcher.utter_message(json_message=response) 

        elif intent == "增加蔓越莓干":
            weight_value = tracker.get_slot("weight")
            if not weight_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["weight"] = weight_value
            response["message"] = f"好的，已为您增加{weight_value}。"
            dispatcher.utter_message(json_message=response)

        elif intent == "减少蔓越莓干":
            weight_value = tracker.get_slot("weight")
            if not weight_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["weight"] = weight_value
            response["message"] = f"好的，已为您减少{weight_value}。"
            dispatcher.utter_message(json_message=response) 

        else:
            # If it's not a recognized command, provide a default response
            dispatcher.utter_message(text="抱歉，我不理解该命令。")
            return []

        # Clear relevant slots if needed
        return [
            SlotSet("time", None)
        ]

