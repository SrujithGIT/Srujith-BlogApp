import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const userAuthorLoginThunk =createAsyncThunk('user-author-login',async(userCredObj,thunkApi)=>{
    try{
    if (userCredObj.userType==='user'){

        const res=await axios.post('http://localhost:4000/user-api/login',userCredObj)
        if (res.data.message ==='login success'){
            localStorage.setItem('token',res.data.token)
            return res.data

        }else{
            return thunkApi.rejectWithValue(res.data.message)
        }
    }else{
        const res=await axios.post(" http://localhost:4000/author-api/login",userCredObj)
        if (res.data.message === 'login success'){
            localStorage.setItem('token',res.data.token)
            return res.data

        }else{
            return thunkApi.rejectWithValue(res.data.message)
        }
    }
}catch(err){
        return thunkApi.rejectWithValue(err)
    }

})

export  const userAuthorSlice=createSlice({
    name:"user-author-login",
    initialState:{
        isPending:false,
        loginUserStatus:false,
        currentUser:{},
        errorOccured:false,
        errMsg:''
    },
    reducers:{
        resetState:(state,action)=>{
            state.isPending=false;
            state.loginUserStatus=false;
            state.currentUser={};
            state.errorOccured=false;
            state.errMsg=''
        }
    },
    extraReducers: (builder)=>builder
    .addCase(userAuthorLoginThunk.pending,(state,action)=>{
        state.isPending=true;
    })
    .addCase(userAuthorLoginThunk.fulfilled,(state,action)=>{
        state.isPending=false;
        state.currentUser=action.payload.user;
        state.loginUserStatus=true;
        state.errMsg='';
        state.errorOccured=false;
    })
    .addCase(userAuthorLoginThunk.rejected,(state,action)=>{
        state.isPending=false;
        state.currentUser={};
        state.loginUserStatus=false;
        state.errMsg=action.payload;
        state.errorOccured=true;
    })

});

export const {resetState}=userAuthorSlice.actions;

export default userAuthorSlice.reducer;