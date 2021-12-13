import axios from 'axios';
import { setAlert } from '../alert';

export const deleteItemAsync = (data) => {
  return async (dispatch) => {
    let config = {
      headers: data.headers,
    };

    const onSuccess = (success) => {
      dispatch(setAlert(`${data.title} was successfully deleted`, 'info'));
      dispatch({ type: data.successType, payload: success.data });

      !data.noReload && dispatch(data.finishedReload());
      return success;
    };
    const onError = (error) => {
      setAlert(`somting wrong, you cant to edit this ${data.title}`, 'error');
      dispatch({ type: data.errorType });
      !data.noReload && dispatch(data.finishedReload());
      return error;
    };
    try {
      !data.noReload && dispatch(data.startReload());
      const success = await axios.delete(`${data.url}/${data.id}`, config);
      return onSuccess(success);
    } catch (error) {
      return onError(error);
    }
  };
};
