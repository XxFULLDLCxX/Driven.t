import axios from 'axios';
import { requestError } from '@/errors';

async function get(url: string, err: CallableFunction = null) {
  try {
    const result = await axios.get(url);
    return result;
  } catch (error) {
    if (!err) {
      const { status, statusText } = error.response;
      throw requestError(status, statusText);
    } else {
      err();
    }
  }
}

export const request = {
  get,
};
