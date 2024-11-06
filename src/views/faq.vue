<template>
    <div class="faq-container">
      <h1>Frequently Asked Questions</h1>
      <br>
      <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
        <div class="card">
          <div class="content">
            <h2>{{ faq.question }}</h2>
            <transition
              name="expand"
              @before-enter="beforeEnter"
              @enter="enter"
              @after-enter="afterEnter"
              @before-leave="beforeLeave"
              @leave="leave"
              @after-leave="afterLeave"
            >
              <p v-if="faq.show">{{ faq.answer }}</p>
            </transition>
          </div>
          <button class="toggle-button" @click="toggleAnswer(index)">
            <i :class="faq.show ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "FAQ",
    data() {
      return {
        faqs: [
          {
            question: "How do I register for an account?",
            answer: "You can register for an account by navigating to the signup page and filling out the registration form with your details.",
            show: false
          },
          {
            question: "How do I log in to my account?",
            answer: "You can log in to your account by navigating to the login page and entering your email and password.",
            show: false
          },
          {
            question: "What should I do if I forget my password?",
            answer: "If you forget your password, you can use the 'Forgot Password' link on the login page to reset it.",
            show: false
          },
          {
            question: "How do I verify my email address?",
            answer: "After registering, you will receive a verification email. Please click the link in the email to verify your address.",
            show: false
          },
          {
            question: "How can I update my profile information?",
            answer: "You can update your profile information by navigating to your account settings and editing your details.",
            show: false
          },
          {
            question: "How do I purchase tickets for an event?",
            answer: "You can purchase tickets by browsing the events, selecting the desired event, and following the purchase process.",
            show: false
          },
          {
            question: "How can I view my purchase history?",
            answer: "You can view your purchase history by navigating to the 'Purchase History' section in your account.",
            show: false
          },
          {
            question: "What payment methods are accepted?",
            answer: "We accept various payment methods including credit/debit cards and PayPal.",
            show: false
          },
          {
            question: "How do I contact customer support?",
            answer: "You can contact customer support by using the contact form on our website or by emailing support@example.com.",
            show: false
          },
          {
            question: "How do I enable dark mode?",
            answer: "You can enable dark mode by toggling the dark mode switch in the sidebar or navbar.",
            show: false
          },
          {
            question: "How do I log out of my account?",
            answer: "You can log out of your account by clicking the logout button in the sidebar or account settings.",
            show: false
          },
          {
            question: "How do I filter events in the marketplace?",
            answer: "You can filter events by categories, price, and date using the filter options in the marketplace section.",
            show: false
          },
          {
            question: "How do I add an event to my cart?",
            answer: "You can add an event to your cart by selecting the event and clicking the 'Add to Cart' button.",
            show: false
          },
          {
            question: "How do I view event details?",
            answer: "You can view event details by clicking on the event in the events list, which will take you to the event details page.",
            show: false
          },
          {
            question: "How do I use the AI chatbot?",
            answer: "The AI chatbot is available on every page of the website. You can interact with it by clicking the chatbot icon and typing your query.",
            show: false
          }
        ]
      };
    },
    methods: {
      toggleAnswer(index) {
        this.faqs[index].show = !this.faqs[index].show;
      },
      beforeEnter(el) {
        el.style.height = '0';
        el.style.opacity = '0';
      },
      enter(el, done) {
        el.style.transition = 'all 0.5s ease';
        el.style.height = el.scrollHeight + 'px';
        el.style.opacity = '1';
        done();
      },
      afterEnter(el) {
        el.style.height = 'auto';
      },
      beforeLeave(el) {
        el.style.height = el.scrollHeight + 'px';
        el.style.opacity = '1';
      },
      leave(el, done) {
        el.style.transition = 'all 0.5s ease';
        el.style.height = '0';
        el.style.opacity = '0';
        done();
      },
      afterLeave(el) {
        el.style.height = '0';
      }
    }
  };
  </script>
  
  <style scoped>
  .faq-container {
    padding: 2rem;
  }
  
  .faq-item {
    margin-bottom: 1.5rem;
  }
  
  .card {
    display: flex;
    align-items: center;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    background-color: var(--bs-card-bg, #fff);
    color: var(--bs-card-color, #000);
    transition: transform 0.2s, background-color 0.2s, color 0.2s;
    text-align: left; /* Align text to the left */
  }
  
  .card:hover {
    transform: translateY(-5px);
  }
  
  .toggle-button {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background-color: #007bff;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: 1rem;
  }
  
  .toggle-button:hover {
    background-color: #0056b3;
  }
  
  .toggle-button i {
    font-size: 1.2rem;
  }
  
  .content {
    flex: 1;
    text-align: left; /* Align text to the left */
  }
  
  .card h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    text-align: left; /* Align text to the left */
  }
  
  .card p {
  font-size: 1rem;
  margin: 0;
  text-align: left !important; /* Ensure text is aligned to the left */
}

.card .content p {
  text-align: left !important; /* More specific selector */
}

/* Dark mode styles */
.dark-mode .card {
  background-color: #1e1e1e;
  color: #ffffff;
}

.dark-mode .toggle-button {
  background-color: #444;
}

.dark-mode .toggle-button:hover {
  background-color: #666;
}
</style>