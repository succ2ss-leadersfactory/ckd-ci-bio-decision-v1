const SOURCE_LABEL = '데이터 신호 확인';
const TARGET_LABEL = 'Data 기반 분류';

function replaceCustomerDataBadgeLabel() {
  document.querySelectorAll('span').forEach((item) => {
    if (item.textContent?.trim() === SOURCE_LABEL) {
      item.textContent = TARGET_LABEL;
      item.setAttribute('aria-label', '고객군 후보를 CRM·콜 Data 기반으로 분류한다는 안내');
    }
  });
}

replaceCustomerDataBadgeLabel();

const observer = new MutationObserver(() => replaceCustomerDataBadgeLabel());
observer.observe(document.body, { childList: true, subtree: true, characterData: true });
