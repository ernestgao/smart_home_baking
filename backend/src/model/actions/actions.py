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
        if intent == "计时":
            # Get the time slot value extracted from the user input
            time_value = tracker.get_slot("time")
            # Check if time was successfully extracted
            if not time_value:
                dispatcher.utter_message(text="抱歉，我没有听清时间，请再试一次。")
                return []
            response["parameters"]["time"] = time_value
            response["message"] = f"好的，已为您设置计时器：{time_value}。"
            dispatcher.utter_message(json_message=response)

        elif intent == "去皮":
            response["parameters"] = {}  # No additional parameters required
            response["message"] = "秤已归零。"
            dispatcher.utter_message(json_message=response)

        else:
            # If it's not a recognized command, provide a default response
            dispatcher.utter_message(text="抱歉，我不理解该命令。")
            return []

        # Clear relevant slots if needed
        return [
            SlotSet("time", None)
        ]

