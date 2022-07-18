import tensorflow as tf
from flask import Flask, request
import numpy as np
import pickle
import os
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/completion', methods=['POST'])
def hello():
    if request.method == 'POST':
        start_string = request.json['string']
        directory = os.getcwd()
        fileName = os.path.join(directory, './server/model.pkl')
        model = pickle.load(open(fileName, 'rb'))

        path_to_file = tf.keras.utils.get_file('nietzsche.txt', 'https://s3.amazonaws.com/text-datasets/nietzsche.txt')
        text = open(path_to_file,'rb').read()
        text = text.decode(encoding='utf-8')
        text = text.replace('\n', ' ')
        vocab = sorted(set(text))
        char2idx = {u:i for i, u in enumerate(vocab)}
        idx2char = np.array(vocab)

        def generate_text(model, num_generate, temperature, start_string):
            input_eval = [char2idx[s] for s in start_string]
            input_eval = tf.expand_dims(input_eval, 0)
            text_generated = []
            model.reset_states()

            for i in range(num_generate):
                predictions = model(input_eval)
                predictions = tf.squeeze(predictions, 0)
                predictions = predictions / temperature
                predicted_id = tf.random.categorical(predictions, num_samples=1)[-1,0].numpy()

                input_eval = tf.expand_dims([predicted_id], 0)
                text_generated.append(idx2char[predicted_id])

            generated_text = start_string + ''.join(text_generated)
            generated_text = generated_text[:generated_text.rfind(' ')] + '.'
            generated_text = ''.join(i for i in generated_text if not i.isdigit())
            return generated_text

        generated_text = generate_text(model, num_generate=500, temperature=1, start_string=start_string)
        response = json.dumps(generated_text)
        return response

if __name__ == "__main__":
    app.run()