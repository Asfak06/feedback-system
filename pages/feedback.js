import { useRouter } from 'next/router';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { HandThumbsUp, HandThumbsDown ,EmojiSmile, EmojiFrown, EmojiNeutral} from 'react-bootstrap-icons';
import { API_BASE_URL, booths } from '../utils';
import Image from 'next/image';

function FeedbackForm() {
  const router = useRouter();
  const { boothNumber} = router.query;
  const [feedback, setFeedback] = useState({});
  const [vote, setVote] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const onUpvote = () => {
    setVote('up');
  };

  const onDownvote = () => {
    setVote('down');
  };
  
  const onNeutralvote = () => {
    setVote('neutral');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const validatePhoneNumber = (number) => {
    const prefix = '88';
    const minLength = 11;
    const maxLength = 13;
    const validPrefix = number.startsWith(prefix);
    const validLength = number.length === minLength || number.length === maxLength;
    const validFormat = validPrefix ? /^(88)?01[3-9]\d{8}$/ : /^01[3-9]\d{8}$/;
    return validLength && validFormat.test(number);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      boothNumber: router.query.boothNumber,
      feedback: event.target.feedback.value ?? ""
    };

    const validPhoneNumber = validatePhoneNumber(phoneNumber);
    if (!data.boothNumber || !vote ||(phoneNumber!='' && !validPhoneNumber)) {
      console.log(validPhoneNumber)
      console.log(data)
      alert('Missing or invalid input data');
      return;
    }

    if (data.feedback.length>50) {
      console.log(validPhoneNumber)
      console.log(data)
      alert('Feedback max character length 20');
      return;
    }

    try {
      console.log(data);
      if(phoneNumber!=''){
         data.phoneNumber=phoneNumber;
      }
      data.vote = vote === 'up' ? 1 : vote === 'down'? -1 : 0;

      const res = await axios.post(`${API_BASE_URL}/api/feedback`, data);
      console.log(res.data);
      alert('Success');
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="container">
      <div className="d-flex flex-column justify-content-center align-items-center mt-4">
        <Image src={'/image2.png'} height={100} width={100} />
        <br/>
        <h1>জেলা প্রশাসকের কার্যালয়, ফরিদপুর</h1>
        <br/>
        <h3><span className='text-danger'>{booths[boothNumber-1]}</span> </h3>
      </div>

      <Form onSubmit={handleSubmit}>
        <h5 className="text-center my-4">আমাদের সেবায় খুশি হলে 🙂 বাটনে, অখুশি হলে 😔 বাটনে, মাঝামাঝি খুশি হলে 😐️ বাটন সিলেক্ট করে সাবমিট করুন। </h5>  
        <Form.Group className="mb-3">
          <div className="d-flex align-items-center justify-content-center">
            <label className={`form-check-label d-flex align-items-center mx-3 ${vote === 'up' ? 'bg-success text-white' : 'bg-light'}`} style={{borderRadius: "8px", padding: "8px", cursor: "pointer"}} onClick={onUpvote}>
              <EmojiSmile
                className={`mx-2 cursor-pointer ${vote === 'up' ? 'text-white' : 'text-success'}`}
                size={28}
              />
            </label>

            <label className={`form-check-label d-flex align-items-center mx-3 ${vote === 'neutral' ? 'bg-warning text-white' : 'bg-light'}`} style={{borderRadius: "8px", padding: "8px", cursor: "pointer"}} onClick={onNeutralvote}>
              <EmojiNeutral
                className={`mx-2 cursor-pointer ${vote === 'neutral' ? 'text-white' : 'text-warning'}`}
                size={28}
              />
            </label>
            
            <label className={`form-check-label d-flex align-items-center mx-3 ${vote === 'down' ? 'bg-danger text-white' : 'bg-light'}`} style={{borderRadius: "8px", padding: "8px", cursor: "pointer"}} onClick={onDownvote}>
              <EmojiFrown
                className={`mx-2 cursor-pointer ${vote === 'down' ? 'text-white' : 'text-danger'}`}
                size={28}
              />
            </label>
          </div>
        </Form.Group>

        <Form.Group className="mb-3 d-flex justify-content-center">
          <div className="w-50">
            <Form.Control
              placeholder='Write opinion (optional)'
              as="textarea"
              rows={3}
              name="feedback"
              onChange={handleInputChange}
              style={{width: "100%", textAlign: "center"}}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3 d-flex justify-content-center">
          <div className="w-50">
            <Form.Control
              placeholder='Phone number (optional)'
              as="input"
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{width: "100%", textAlign: "center"}}
            />
          </div>
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button variant="success" type="submit" className="rounded-pill" style={{width: "200px"}}>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default FeedbackForm;
