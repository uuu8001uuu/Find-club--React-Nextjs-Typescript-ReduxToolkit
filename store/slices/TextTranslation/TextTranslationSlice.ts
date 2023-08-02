import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Constants, ML } from '../../../globals';
import { AlertsSlice } from '../../slices';
import { AppState, AppDispatch } from '../../store';
import { LanguageTranslationInterface } from '../../../interfaces';

interface InitialState {
	entities: LanguageTranslationInterface.TextTranslation;
  status: Constants.statusFetch.succeeded | Constants.statusFetch.failed | Constants.statusFetch.loading;
	error: string | null;
}

const initialState: InitialState = {
  entities: {},
  status: Constants.statusFetch.succeeded,
	error: null,
}

const updateLanguageAsync = createAsyncThunk<LanguageTranslationInterface.TextTranslation, LanguageTranslationInterface.TextTranslation | undefined, {dispatch: AppDispatch}>(
  'textTranslation/updateLanguageAsync',
  async (text, {dispatch, rejectWithValue}) => {
		const textDb = text ? text : await ML.getTranslationText();
		const currentTranslationText = await ML.getChangeTranslationText(textDb)

		if (!currentTranslationText) {
			dispatch(AlertsSlice.add('Ошибка загрузки переведенного текста', '', 'danger'));
			return rejectWithValue('no get ML.getTranslationText')
		}
		console.log
		return currentTranslationText as LanguageTranslationInterface.TextTranslation
  }
)

const textTranslationSlices = createSlice({
	name: 'textTranslation',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
    builder
      .addCase(updateLanguageAsync.pending, (state) => {
        state.status = Constants.statusFetch.loading
				state.error = null
      })
      .addCase(updateLanguageAsync.rejected, (state, action) => {
				state.status = Constants.statusFetch.failed
        state.error = action.payload
      })
      .addCase(updateLanguageAsync.fulfilled, (state, action) => {
        state.status = Constants.statusFetch.succeeded
        state.entities = action.payload
				state.error = null
      })
  },
});

const reducer = textTranslationSlices.reducer

const textTranslationSelect = (state: AppState) => {
	return state.textTranslation.entities
}

export {
	updateLanguageAsync,
	reducer,
	textTranslationSelect,
}