from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
import streamlit as st

from langchain.chains import LLMChain
from langchain.embeddings.openai import OpenAIEmbeddings
import os
from langchain.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)
from langchain.memory import ConversationBufferMemory

from constants import openai_key
os.environ["OPENAI_API_KEY"]=openai_key
llm = ChatOpenAI()
st.title("Chat with your AI Assistant")

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

questions = []

for question in questions :
    chat = ChatOpenAI(temperature=0,openai_api_key=openai_key)
    template=""
    system_message_prompt = SystemMessagePromptTemplate.from_template(template)
    human_template=question
    human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)
    chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, MessagesPlaceholder(
            variable_name="chat_history"
        ), human_message_prompt])
    chat_llm_chain = LLMChain(
    llm=llm,
    prompt=chat_prompt,
    verbose=True,
    memory=memory,
    )
    response = chat_llm_chain.predict(human_input=question)
    print(response)