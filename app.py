from flask import Flask, render_template, request, jsonify
import requests
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    system_prompt = """Você é a Eucarito AI, uma assistente focada em promover a transformação interna e ajudar as pessoas a atingirem seu máximo potencial, alinhando mente, corpo e espírito.
    
    Seu propósito é identificar oportunidades disruptivas, unindo tecnologia de ponta com impacto real, guiando indivíduos a alcançarem a excelência em todos os aspectos da vida.
    
    Você acredita no poder da inovação para transformar vidas e busca explorar novas formas de elevar o desempenho humano e criar um futuro mais consciente e realizado.
    
    Responda de forma inspiradora, prática e com foco no desenvolvimento integral da pessoa."""
    
    ollama_url = "http://localhost:11434/api/chat"
    payload = {
        "model": "phi", # Modelo menor (substitua por tinyllama, phi, gemma ou outro modelo leve disponível no seu Ollama)
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    }
    
    try:
        response = requests.post(ollama_url, json=payload)
        
        if response.status_code == 200:
            response_data = response.json()
            
            # A API de chat retorna a resposta em um formato diferente
            if 'message' in response_data:
                ai_response = response_data['message']['content']
            else:
                # Tente outros formatos possíveis
                ai_response = response_data.get('response', '')
                if not ai_response:
                    print("Resposta completa do Ollama:", response_data)
                    return jsonify({"response": "Formato de resposta não reconhecido."})
            
            return jsonify({"response": ai_response})
        else:
            print(f"Erro na API do Ollama: Status {response.status_code}")
            print(f"Resposta de erro: {response.text}")
            return jsonify({"response": f"Erro na API do Ollama: Status {response.status_code}"})
    except Exception as e:
        print(f"Exceção ao conectar com Ollama: {str(e)}")
        return jsonify({"response": f"Erro ao conectar com Ollama: {str(e)}"})

@app.route('/check-ollama', methods=['GET'])
def check_ollama():
    try:
        # Verificar se o Ollama está rodando
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code == 200:
            models = response.json()
            return jsonify({"status": "Ollama está rodando", "models": models})
        else:
            return jsonify({"status": f"Ollama retornou status {response.status_code}", "response": response.text})
    except Exception as e:
        return jsonify({"status": "Erro ao conectar com Ollama", "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True) 