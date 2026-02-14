import mongoose from 'mongoose';

const userGradeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
    grade: {
        type: Number,
        required: true
    },
    motivation : {
        type : String,
        required : true
    }
}
)
const userGrade = mongoose.model("userGradeDetails",userGradeSchema);
export default userGrade;