import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://transformapp-backend-production.up.railway.app',
});
api.interceptors.request.use((c) => {
  const t = Cookies.get('token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

export const login = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try { const { data } = await api.post('/api/auth/login', creds); Cookies.set('token', data.token, { expires: 7 }); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.error || 'Error al iniciar sesión'); }
});
export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/api/auth/register', payload); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.error || 'Error al registrarse'); }
});
export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/api/auth/verify-otp', payload); Cookies.set('token', data.token, { expires: 7 }); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.error || 'Código inválido'); }
});
export const fetchProgress = createAsyncThunk('progress/fetch', async () => {
  const { data } = await api.get('/api/progress/summary'); return data;
});
export const completeStage = createAsyncThunk('progress/complete', async (idx) => {
  const { data } = await api.post(`/api/progress/complete/${idx}`); return { idx, ...data };
});
export const saveSurvey = createAsyncThunk('user/survey', async (payload) => {
  const { data } = await api.post('/api/user/survey', payload); return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, userId: null, loading: false, error: null },
  reducers: {
    logout: (s) => { s.user = null; Cookies.remove('token'); },
    clearError: (s) => { s.error = null; },
    updatePlan: (s, { payload }) => { if (s.user) s.user.plan = payload; },
    hydrateUser: (s, { payload }) => { s.user = payload; },
  },
  extraReducers: (b) => {
    b.addCase(login.pending,       (s) => { s.loading = true; s.error = null; })
     .addCase(login.fulfilled,     (s, { payload }) => { s.loading = false; s.user = payload.user; })
     .addCase(login.rejected,      (s, { payload }) => { s.loading = false; s.error = payload; })
     .addCase(register.pending,    (s) => { s.loading = true; s.error = null; })
     .addCase(register.fulfilled,  (s, { payload }) => { s.loading = false; s.userId = payload.userId; })
     .addCase(register.rejected,   (s, { payload }) => { s.loading = false; s.error = payload; })
     .addCase(verifyOTP.fulfilled, (s, { payload }) => { s.user = payload.user; s.userId = null; })
     .addCase(verifyOTP.rejected,  (s, { payload }) => { s.error = payload; });
  },
});

const progressSlice = createSlice({
  name: 'progress',
  initialState: { stages: [], completed: 0, percent: 0, streak: null, area: null, loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProgress.pending,   (s) => { s.loading = true; })
     .addCase(fetchProgress.fulfilled, (s, { payload }) => {
       s.loading = false; s.stages = payload.stages; s.completed = payload.completed;
       s.percent = payload.percent; s.streak = payload.streak; s.area = payload.area;
     })
     .addCase(completeStage.fulfilled, (s, { payload }) => {
       const st = s.stages.find(x => x.stage_index === payload.idx);
       if (st) st.status = 'completed';
       if (payload.nextUnlocked !== null) {
         const nx = s.stages.find(x => x.stage_index === payload.nextUnlocked);
         if (nx) nx.status = 'active';
         else s.stages.push({ stage_index: payload.nextUnlocked, status: 'active' });
       }
       s.completed = s.stages.filter(x => x.status === 'completed').length;
       s.percent = Math.round((s.completed / 8) * 100);
     });
  },
});

const userSlice = createSlice({
  name: 'user',
  initialState: { survey: null },
  reducers: { setSurveyLocal: (s, { payload }) => { s.survey = payload; } },
  extraReducers: (b) => { b.addCase(saveSurvey.fulfilled, (s, { payload }) => { s.survey = payload; }); },
});

export const store = configureStore({
  reducer: { auth: authSlice.reducer, progress: progressSlice.reducer, user: userSlice.reducer },
});

export const { logout, clearError, updatePlan, hydrateUser } = authSlice.actions;
export const { setSurveyLocal } = userSlice.actions;
export { api };
