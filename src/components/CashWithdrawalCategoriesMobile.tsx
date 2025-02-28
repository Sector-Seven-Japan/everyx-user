import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "./Loader/Loader";

export default function CashWithdrawalCategoriesMobile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const currentPath = usePathname(); // Get the current page path
  // const { getDepositAddress } = useContext(AppContext);

  const handleNavigation = (path: string) => {
    if (currentPath === path) return; // Don't show loader if already on the same page
    setIsLoading(true);
    router.push(path);
  };

  return (
    <div className="w-full bg-transparent">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader />
        </div>
      )}
      <nav className="">
        <ul className="grid grid-cols-4 gap-5">
          <li>
            <button
              onClick={() => handleNavigation("/deposits")}
              type="button"
              className="w-full flex flex-col items-center justify-center p-4 rounded-xl  border border-white opacity-10 hover:opacity-100 transition-colors gap-1"
            >
              <svg
                width="5vw"
                height="5vw"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.0352 7.85598V5.35561C16.0347 4.79484 15.8672 4.25062 15.5597 3.81085C15.2522 3.37108 14.8227 3.06143 14.3405 2.93192C14.2948 2.30871 14.0439 1.72768 13.6374 1.304C13.2309 0.880332 12.6986 0.644954 12.146 0.644531H4.22449C3.43496 0.645128 2.67172 0.965681 2.07304 1.54813C1.47436 2.13057 1.07981 2.93639 0.960881 3.81961H0.917969V12.5577C0.917969 13.55 1.26633 14.5017 1.88643 15.2034C2.50652 15.9051 3.34754 16.2993 4.22449 16.2993H13.8293C14.4144 16.2993 14.9754 16.0363 15.3891 15.5682C15.8028 15.1001 16.0352 14.4652 16.0352 13.8032V12.2229C16.1896 12.1738 16.3256 12.069 16.4226 11.9245C16.5196 11.78 16.5723 11.6036 16.5727 11.4221V8.65848C16.5724 8.47678 16.5198 8.30014 16.4228 8.15533C16.3258 8.01053 16.1897 7.90543 16.0352 7.85598ZM15.2974 13.8057C15.2972 14.2455 15.1427 14.6672 14.8678 14.9781C14.5929 15.2889 14.2202 15.4636 13.8316 15.4636H4.22449C3.88736 15.4636 3.55354 15.3884 3.24211 15.2423C2.93067 15.0963 2.64773 14.8822 2.40945 14.6123C2.17118 14.3424 1.98223 14.0221 1.85343 13.6695C1.72462 13.317 1.65848 12.9392 1.65877 12.5577V4.41936L1.6648 4.2575C1.69239 3.51046 1.97421 2.80443 2.45128 2.28712C2.92836 1.76982 3.56374 1.48131 4.22449 1.48196H12.146C12.4915 1.48192 12.8258 1.62033 13.0897 1.87264C13.3536 2.12496 13.53 2.47488 13.5877 2.86036H2.9341C2.83596 2.86036 2.74185 2.90447 2.67245 2.983C2.60306 3.06152 2.56408 3.16802 2.56408 3.27907C2.56408 3.39012 2.60306 3.49663 2.67245 3.57515C2.74185 3.65368 2.83596 3.69779 2.9341 3.69779H13.8745L13.9498 3.7046C14.3166 3.73818 14.6587 3.92661 14.9084 4.23247C15.158 4.53833 15.2969 4.93925 15.2974 5.35561V7.82105H11.8765C11.6189 7.82082 11.3638 7.87812 11.1258 7.98966C10.8879 8.1012 10.6717 8.2648 10.4897 8.47106C10.1221 8.88736 9.91561 9.45178 9.91561 10.0403C9.91561 10.6288 10.1221 11.1932 10.4897 11.6095C10.6717 11.8158 10.8879 11.9794 11.1258 12.0909C11.3638 12.2025 11.6189 12.2597 11.8765 12.2595H15.2974V13.8057ZM15.8342 11.4204H11.8765C11.635 11.4202 11.399 11.3391 11.1983 11.1872C10.9975 11.0353 10.8411 10.8195 10.7488 10.567C10.6564 10.3145 10.6323 10.0367 10.6795 9.76876C10.7266 9.50078 10.8429 9.25464 11.0137 9.06144C11.1267 8.93281 11.2612 8.83083 11.4093 8.76137C11.5574 8.69191 11.7161 8.65636 11.8765 8.65678H15.8319L15.8342 11.4204Z"
                  fill="white"
                />
              </svg>
              <span className="text-[12px] md:text-[10px] lg:text-[10px] text-white">
                Deposits
              </span>
            </button>
          </li>
          <li>
            <button
              className="w-full flex flex-col items-center justify-center p-4 lg:p-2 md:p-2 rounded-xl  border border-white opacity-10 hover:opacity-100 transition-colors gap-1"
              type="button"
              // onClick={() => handleNavigation("/deposit-withdrawal/withdrawal")}
            >
              <svg
                width="5vw"
                height="5vw"
                viewBox="0 0 24 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.548 0.923887C23.4747 0.83397 23.3835 0.762326 23.2811 0.714067C23.1786 0.665808 23.0674 0.64213 22.9553 0.644724C22.9099 0.644994 22.8646 0.648257 22.8196 0.654494C22.0794 0.75702 21.3342 0.813876 20.5878 0.824783C20.2983 0.827442 20.0091 0.810192 19.7218 0.773139C19.3528 0.714421 18.9805 0.682011 18.6075 0.676129C18.1423 0.651912 17.6802 0.767817 17.2746 1.01043C16.8683 1.29882 16.5752 1.7343 16.4501 2.23528C16.3227 2.59907 16.1686 2.95167 15.9891 3.28984C15.6065 4.04716 15.1789 4.77796 14.7088 5.47781C14.4953 5.79777 14.2639 6.104 14.0161 6.39487C13.8544 6.59554 13.6653 6.76939 13.455 6.91063C13.4053 6.94077 13.366 6.98701 13.343 7.04254C12.9545 7.24005 12.5639 7.45222 12.1741 7.66509C11.2646 8.19576 10.3155 8.64628 9.33637 9.01207C9.26275 8.98474 9.19063 8.95305 9.12036 8.91715C8.31761 8.47352 7.54046 7.97969 6.79304 7.43826C6.36103 7.13537 5.94614 6.83456 5.60764 6.58052C5.26914 6.32648 5.00111 6.11641 4.87665 6.00613C4.61824 5.7663 4.28822 5.63085 3.94479 5.62367C3.71978 5.62779 3.49935 5.69174 3.30373 5.80966C3.10812 5.92758 2.94359 6.0957 2.82525 6.29856C2.46929 6.6485 2.09695 6.97926 1.70966 7.2896C1.5121 7.44664 1.32573 7.5925 1.16175 7.70835C1.03608 7.80172 0.905956 7.88814 0.771882 7.96728C0.736344 7.98463 0.703834 8.00822 0.675734 8.03707C0.636096 8.08409 0.607845 8.14062 0.593414 8.20178C0.582282 8.24734 0.577184 8.29432 0.578268 8.34137C0.584252 8.49794 0.618922 8.65178 0.680343 8.79432C0.789974 9.07131 0.95724 9.31848 1.16965 9.51736C1.42237 9.7601 1.75056 9.89574 2.09162 9.89842C2.33069 9.89401 2.56598 9.83447 2.78113 9.72394C2.78966 9.98599 2.87687 10.2383 3.03006 10.4442C3.11361 10.5575 3.22017 10.6494 3.34181 10.713C3.46346 10.7767 3.59707 10.8105 3.73274 10.812C3.94689 10.8069 4.15471 10.734 4.32939 10.6026C4.34981 10.6511 4.37381 10.6978 4.40117 10.7422C4.50036 10.8949 4.6342 11.0188 4.79038 11.1023C4.92009 11.1776 5.06529 11.2179 5.21317 11.2196C5.36363 11.2178 5.5111 11.1747 5.64123 11.0947C5.77841 11.0057 5.90857 10.9051 6.03043 10.7939C5.85789 12.3021 5.60764 14.4837 5.44234 15.925C6.00381 16.2205 6.6317 16.3449 7.256 16.2844C8.58035 16.1811 9.98043 15.4183 11.3805 14.6561C12.7806 13.894 14.182 13.1284 15.5083 13.0237C15.8435 12.9949 16.1808 13.0154 16.5107 13.0844C16.7429 13.146 16.9694 13.2294 17.1876 13.3336L17.2252 13.3385L17.2838 13.3147C17.2985 13.3031 17.3108 13.2884 17.3201 13.2716C17.3293 13.2549 17.3354 13.2363 17.3378 13.217C17.3602 13.0153 17.756 9.55924 18.0293 7.16817C18.1215 7.17515 18.2137 7.18143 18.3019 7.18143C18.796 7.19724 19.2837 7.05996 19.7053 6.7864C19.8664 6.67739 20.0051 6.53495 20.1129 6.36765C20.2131 6.21525 20.2683 6.03479 20.2716 5.8491C20.2707 5.76409 20.2562 5.67985 20.2288 5.59994C20.5764 5.52406 20.8977 5.34884 21.1581 5.09326C21.3121 4.94394 21.4406 4.76757 21.538 4.57191C21.6304 4.39268 21.6807 4.19259 21.6849 3.98845C21.6857 3.87584 21.6648 3.76424 21.6237 3.66043C22.1363 3.57107 22.6183 3.34212 23.0224 2.99601C23.2334 2.8239 23.4072 2.60594 23.5322 2.35676C23.6571 2.10758 23.7303 1.83295 23.7468 1.55132C23.7527 1.32382 23.6822 1.1015 23.548 0.923887ZM5.88028 10.202C5.74256 10.3003 5.60958 10.4058 5.48186 10.5182C5.43491 10.5558 5.38437 10.5881 5.33105 10.6145C5.29394 10.633 5.25351 10.6427 5.21251 10.6431C5.15251 10.641 5.09392 10.6233 5.04194 10.5915C4.96644 10.5521 4.90129 10.4936 4.85228 10.4212C4.81784 10.368 4.79967 10.3049 4.80025 10.2404C4.80352 10.1585 4.82617 10.0789 4.86611 10.0087C4.8964 9.96194 4.92735 9.91727 4.95831 9.86911C4.99755 9.80701 5.01243 9.73116 4.9998 9.65763C4.98718 9.5841 4.94803 9.51867 4.89066 9.4752C4.83329 9.43173 4.76221 9.41365 4.69247 9.42478C4.62274 9.4359 4.55983 9.47537 4.51708 9.53481C4.50983 9.54388 4.50522 9.55435 4.49864 9.56343C4.49595 9.56835 4.49286 9.57302 4.48942 9.57738C4.45766 9.62205 4.42841 9.66866 4.40183 9.71697C4.30589 9.86718 4.18757 9.99988 4.05148 10.1099C3.96102 10.1875 3.84965 10.2327 3.7334 10.239C3.6785 10.2379 3.62457 10.2234 3.57581 10.1967C3.52704 10.1699 3.48475 10.1316 3.45219 10.0848C3.35913 9.95602 3.31262 9.79623 3.32108 9.6343C3.32953 9.47236 3.3924 9.31898 3.49829 9.2019C3.54495 9.14754 3.57025 9.07634 3.56903 9.00287C3.5678 8.92939 3.54014 8.85919 3.4917 8.8066C3.44326 8.75402 3.3777 8.72303 3.30842 8.71997C3.23914 8.7169 3.17137 8.742 3.11897 8.79013C2.85169 9.0976 2.48587 9.28845 2.09294 9.32543C1.95421 9.32538 1.81793 9.28663 1.69781 9.21307C1.52176 9.10087 1.37576 8.94277 1.2737 8.75384C1.22892 8.67435 1.19207 8.59015 1.16372 8.50259C1.15384 8.47118 1.1466 8.44257 1.14133 8.41814C1.24143 8.35603 1.35207 8.28344 1.47983 8.19062C2.09523 7.74003 2.67933 7.24324 3.22763 6.70405L3.27175 6.64682C3.33908 6.51653 3.43743 6.40719 3.55701 6.32968C3.67659 6.25218 3.81324 6.2092 3.95335 6.20504C4.1696 6.21201 4.37644 6.30034 4.53683 6.4542C4.70806 6.60495 5.03602 6.85969 5.4542 7.16887C6.07916 7.63228 6.89709 8.21155 7.62742 8.68823C7.9488 8.89761 8.25173 9.08605 8.51779 9.23889C8.36303 9.26681 8.20827 9.29054 8.0568 9.30171C7.69352 9.33221 7.32798 9.30373 6.97282 9.21726C6.76704 9.15824 6.56616 9.08145 6.37222 8.98764L6.33666 8.98345L6.27739 9.00648C6.26252 9.01801 6.25001 9.03261 6.24062 9.04941C6.23122 9.0662 6.22514 9.08484 6.22273 9.10419C6.21549 9.16631 6.17268 9.54249 6.1088 10.1001C6.02846 10.1225 5.95152 10.1568 5.88028 10.202ZM7.34754 15.4601C7.29815 15.4636 7.24744 15.4678 7.19739 15.4699C7.1996 15.1913 7.12092 14.9188 6.97202 14.6892C6.82311 14.4596 6.61119 14.2841 6.36498 14.1864C6.47825 13.1968 6.5913 12.2064 6.70413 11.2154C6.73901 11.2173 6.77396 11.2173 6.80884 11.2154C7.06014 11.1651 7.2907 11.0339 7.46911 10.8397C7.64752 10.6455 7.76512 10.3977 7.80589 10.1301C7.85594 10.1301 7.90665 10.1259 7.9567 10.1211C8.99858 9.97906 10.0068 9.63457 10.9307 9.10489C10.1312 9.9944 9.60614 11.1207 9.42527 12.3342C9.29356 13.4836 9.6584 14.296 10.3216 14.4482C9.39703 14.9756 8.38897 15.3186 7.34754 15.4601ZM12.2808 12.1653C12.1676 12.2558 12.049 12.3386 11.9258 12.413C11.912 12.5393 11.8962 12.6678 11.8804 12.7955L11.5603 12.9679C11.5755 12.8422 11.5906 12.7159 11.6025 12.5903C11.505 12.6426 11.4049 12.6964 11.3114 12.7494C11.2995 12.875 11.2837 13.0014 11.2699 13.1284L10.9492 13.3008C10.9643 13.1745 10.9788 13.0481 10.9913 12.9225C10.9064 12.9672 10.8207 13.0132 10.7358 13.0558C10.6271 13.1151 10.5178 13.1703 10.4065 13.2268C10.4184 13.1102 10.4335 12.9958 10.4447 12.8778C10.443 12.8477 10.4492 12.8176 10.4625 12.7909C10.4759 12.7641 10.4959 12.7418 10.5204 12.7264L10.5468 12.7082C10.5573 12.6999 10.6851 12.6266 10.7147 12.6105C10.7385 12.5961 10.7587 12.576 10.7737 12.5517C10.7887 12.5275 10.798 12.4998 10.801 12.471C10.866 11.9098 10.9303 11.3475 10.9939 10.7841C10.9999 10.7373 10.9847 10.7206 10.9584 10.7227L10.9294 10.731C10.9011 10.7422 10.7753 10.8008 10.7628 10.8071L10.7391 10.8134L10.7167 10.8183C10.6778 10.8183 10.6871 10.7806 10.6943 10.7241C10.7055 10.6187 10.7167 10.5147 10.7286 10.4128L11.0578 10.2446L11.312 10.1092C11.3272 9.98008 11.3417 9.84957 11.3575 9.71906C11.4642 9.66323 11.5708 9.6046 11.6775 9.54667C11.6624 9.67718 11.6479 9.80839 11.6327 9.93611C11.7315 9.88516 11.8264 9.83212 11.9238 9.77908C11.939 9.64927 11.9535 9.51806 11.9693 9.39034C12.076 9.33102 12.1826 9.271 12.2913 9.21307C12.2755 9.34637 12.2617 9.47898 12.2432 9.61228C12.3589 9.55627 12.4823 9.52045 12.6087 9.5062C12.6587 9.50083 12.7091 9.50533 12.7576 9.51945C12.7921 9.52835 12.8243 9.54558 12.8516 9.56978C12.8789 9.59399 12.9006 9.62453 12.9149 9.65904C12.944 9.74871 12.9519 9.84455 12.938 9.9382C12.9299 10.0085 12.9129 10.0773 12.8873 10.1427C12.8574 10.2182 12.821 10.2906 12.7786 10.3591C12.6811 10.5084 12.5692 10.6467 12.4447 10.7715C12.5099 10.7465 12.5779 10.7303 12.6469 10.7234C12.8675 10.7059 12.9564 10.8483 12.9268 11.1107C12.91 11.2376 12.8735 11.3607 12.8188 11.475C12.757 11.6067 12.6797 11.7295 12.589 11.8407C12.4986 11.9613 12.3951 12.0702 12.2808 12.1653ZM16.8551 11.103C16.8217 11.1008 16.7883 11.1008 16.755 11.103C16.5027 11.1523 16.271 11.2831 16.0918 11.4776C15.9125 11.672 15.7945 11.9206 15.754 12.189C15.7039 12.189 15.6539 12.1953 15.6025 12.1988C14.5611 12.3418 13.5534 12.6867 12.6298 13.2163C13.4283 12.3261 13.9532 11.2001 14.1352 9.98706C14.267 8.83898 13.9015 8.02521 13.2376 7.87236C14.1622 7.34462 15.1702 7.0007 16.2117 6.8576L16.3631 6.84922C16.3597 7.128 16.4379 7.40106 16.587 7.63078C16.7361 7.86051 16.9487 8.03562 17.1955 8.13199C17.0818 9.12211 16.9688 10.1125 16.8551 11.103ZM22.6727 2.55632C22.1519 2.9795 21.5068 3.19405 20.8512 3.16211C20.781 3.16274 20.7139 3.19213 20.6637 3.24411C20.6136 3.29609 20.5844 3.36662 20.5823 3.44091C20.5801 3.51521 20.6052 3.58749 20.6523 3.6426C20.6994 3.69771 20.7647 3.73137 20.8347 3.7365C20.9268 3.73348 21.0168 3.76513 21.0889 3.82584C21.1081 3.84744 21.1227 3.87312 21.1317 3.90115C21.1408 3.92918 21.1442 3.95894 21.1416 3.98845C21.1367 4.10022 21.1072 4.20921 21.0553 4.3067C20.9459 4.51914 20.7873 4.69856 20.5943 4.82804C20.3721 4.98215 20.1125 5.06459 19.8469 5.06534C19.7326 5.06502 19.6188 5.0505 19.5077 5.02207H19.4998C19.4333 5.01417 19.3663 5.03265 19.3118 5.07394C19.2574 5.11523 19.2192 5.17641 19.2047 5.24571C19.1903 5.31501 19.2005 5.38754 19.2335 5.44933C19.2664 5.51111 19.3198 5.5578 19.3833 5.5804H19.3912C19.494 5.59592 19.5907 5.64161 19.6704 5.71231C19.6877 5.7292 19.7014 5.74971 19.7108 5.77253C19.7202 5.79536 19.7251 5.82 19.725 5.84491C19.7214 5.91716 19.6986 5.98685 19.6592 6.04591C19.5427 6.21266 19.3847 6.34172 19.2028 6.4186C18.9176 6.54531 18.6105 6.60759 18.3013 6.60146C18.2354 6.60146 18.1643 6.59657 18.0932 6.59029C18.1011 6.5205 18.1083 6.45629 18.1155 6.39139C17.5549 6.09613 16.9279 5.97192 16.3045 6.03266C15.7591 6.08646 15.2228 6.21744 14.7102 6.42209C15.2153 5.7477 15.674 5.03561 16.0826 4.29135C16.294 3.91098 16.4823 3.54458 16.6345 3.22283C16.7624 2.96003 16.8725 2.68785 16.9637 2.40836C17.0498 2.03772 17.2605 1.71311 17.5564 1.49548C17.8764 1.31211 18.2384 1.22726 18.6016 1.25051C18.9499 1.25635 19.2975 1.2869 19.6421 1.34194C19.9538 1.38315 20.2677 1.40227 20.5818 1.39917C21.3527 1.38865 22.1223 1.33039 22.8868 1.22469L22.9526 1.2205C22.9856 1.21687 23.019 1.22161 23.0499 1.23436C23.0808 1.2471 23.1084 1.26748 23.1304 1.29379C23.181 1.36773 23.2054 1.45813 23.1996 1.54922C23.1827 1.74668 23.1271 1.93822 23.0363 2.11154C22.9454 2.28486 22.8214 2.43613 22.6721 2.55562L22.6727 2.55632Z"
                  fill="white"
                />
              </svg>

              <span className="text-[12px] md:text-[10px] lg:text-[10px] text-white">
                Withdrawal
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="w-full flex flex-col items-center justify-center p-4 lg:p-2 md:p-2 rounded-xl  border border-white opacity-10 hover:opacity-100 transition-colors gap-1"
              onClick={() => handleNavigation("/deposit-withdrawal/portfolio")}
            >
              <svg
                width="5vw"
                height="5vw"
                viewBox="0 0 23 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.4612 4.98999L12.221 4.93421L11.7845 3.77216C11.7481 3.6752 11.6554 3.61133 11.5523 3.61133C11.4488 3.61133 11.3564 3.6752 11.3199 3.77216L10.8835 4.93421L9.64313 4.98999C9.54 4.99462 9.45054 5.06311 9.41843 5.16161C9.38645 5.25977 9.41877 5.36751 9.49976 5.43215L10.4698 6.20633L10.1403 7.40306C10.1128 7.50272 10.1497 7.60892 10.2334 7.66975C10.317 7.73088 10.4296 7.73285 10.5158 7.67592L11.5523 6.99245L12.5886 7.67583C12.6749 7.73277 12.7875 7.73084 12.8712 7.66967C12.9546 7.60888 12.9918 7.50263 12.9643 7.40298L12.6345 6.20624L13.6048 5.43207C13.6856 5.36743 13.7181 5.25968 13.6862 5.16152C13.654 5.06306 13.5645 4.99462 13.4612 4.98999Z"
                  fill="white"
                />
                <path
                  d="M18.6587 1.43591V0.197266H4.56348V1.43591H0.59375V2.22126C0.59375 2.22126 0.59375 4.07209 0.59375 5.92296C0.594906 6.54479 0.779022 7.17933 1.10684 7.78886H1.10701C1.60054 8.70195 2.42784 9.57163 3.56011 10.2354L3.57723 10.2454L3.56028 10.2354C4.66502 10.8818 6.06376 11.3259 7.71665 11.4102L9.2037 13.2152V13.2156C9.51478 13.5931 9.67912 14.051 9.67929 14.5216V15.6671L6.26885 16.8069V19.602H16.9535V18.8752V16.8069L13.5429 15.6671V14.5216C13.543 14.0509 13.7073 13.593 14.0185 13.2156L15.5136 11.4012C17.6721 11.2658 19.3867 10.5143 20.5744 9.50883H20.5742C21.191 8.98705 21.6688 8.3987 21.9978 7.78882H21.998C22.326 7.17928 22.5101 6.54474 22.5113 5.92331C22.5113 4.99789 22.5113 4.07205 22.5113 3.37826C22.5113 3.03079 22.5113 2.74145 22.5113 2.5394C22.5113 2.33658 22.5113 2.22155 22.5113 2.22117V1.43591H18.6587ZM3.41739 8.46073C2.92292 8.04246 2.55524 7.58189 2.31552 7.13703C2.07502 6.69256 1.96595 6.26547 1.96689 5.92301C1.96689 4.99798 1.96689 4.07213 1.96689 3.37835C1.96689 3.16439 1.96689 2.97236 1.96689 2.8096H4.76052V5.34275C4.76035 6.75031 5.25692 8.11591 6.16406 9.21646L6.75103 9.92912C5.31925 9.68935 4.20792 9.12836 3.41739 8.46073ZM13.0495 12.4168C12.5576 13.0132 12.2873 13.7559 12.2873 14.5216V16.5714L15.6979 17.7112V18.3465H7.52431V17.7112L10.9349 16.5714V14.5216C10.9353 13.7559 10.6646 13.0132 10.1726 12.4172L6.98096 8.54305C6.22617 7.62684 5.81907 6.50134 5.81907 5.34275V1.45247H17.4033V5.34275C17.4031 6.50138 16.996 7.62688 16.2413 8.54305L13.0495 12.4168ZM21.138 5.92301C21.1389 6.26551 21.03 6.6926 20.7893 7.13703C20.4301 7.80423 19.7821 8.50576 18.8509 9.04985C18.2016 9.42998 17.4149 9.73512 16.4904 9.90558L17.0582 9.21642C17.9657 8.11587 18.4621 6.75027 18.4617 5.34271V2.8096H21.138C21.138 3.50227 21.138 4.71245 21.138 5.92301Z"
                  fill="white"
                />
              </svg>

              <span className="text-[12px] md:text-[10px] lg:text-[10px] text-white">
                Results
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="w-full flex flex-col items-center justify-center p-4 lg:p-2 md:p-2 rounded-xl  border border-white opacity-10 hover:opacity-100 transition-colors gap-1"
              onClick={() => handleNavigation("/deposit-withdrawal/history")}
            >
              <svg
                width="5vw"
                height="5vw"
                viewBox="0 0 12 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.8398 15.7961L10.8398 15.7961L10.8262 15.7841L10.818 15.7769H10.7873H10.7873H10.708C10.7078 15.7793 10.7077 15.7817 10.7077 15.7841V15.7769H10.443H1.32721H1.0625V15.7841C1.0625 15.7818 1.06241 15.7794 1.06221 15.7769H0.952209H0.881359H0.827211V15.2769V1.51104V1.01104H0.881359H0.948678H1.06241C1.06247 1.00964 1.0625 1.00829 1.0625 1.00698V1.01104H1.32721H7.47873H7.61507V0.646484H0.881359C0.796792 0.646484 0.715689 0.684465 0.655891 0.75207C0.596093 0.819676 0.5625 0.911369 0.5625 1.00698V15.7841C0.5625 15.8797 0.596093 15.9714 0.655891 16.039C0.715689 16.1066 0.796792 16.1446 0.881359 16.1446H10.8889C10.9308 16.1446 10.9722 16.1352 11.0109 16.1171C11.0496 16.099 11.0847 16.0725 11.1143 16.039C11.144 16.0055 11.1674 15.9658 11.1835 15.922C11.1995 15.8783 11.2077 15.8314 11.2077 15.7841V4.71396H10.9465L10.9465 4.93824L10.943 15.2771L10.9429 15.7769H10.8889H10.8516H10.8516H10.818L10.8262 15.7841L10.8398 15.7961ZM10.8398 15.7961L10.8398 15.7961L10.8753 15.8275L10.8753 15.8275L10.8398 15.7961ZM11.2077 4.0345V4.50331L10.9751 4.24025L11.2077 4.0345ZM11.2077 4.0345L8.21169 0.646484M11.2077 4.0345H10.7931L10.6588 3.8827L8.48959 1.43025L8.21169 1.11607V0.646484M8.21169 0.646484H7.79634L7.97863 0.852582L8.21169 0.646484ZM8.11507 2.5162L7.97873 2.36206V4.21396V4.23581C7.97873 4.27034 7.9848 4.30336 7.99549 4.33255C8.00618 4.36171 8.02054 4.38457 8.03518 4.40112C8.04971 4.41755 8.06361 4.42683 8.07422 4.43181L8.11507 2.5162ZM8.11507 2.5162V3.71396V4.21396H8.61507H9.61676L8.11507 2.5162ZM10.517 4.00814L10.7077 4.22386V4.43807H10.4465H10.2843H10.0309L10.2843 4.21396V3.74501L10.517 4.00814ZM10.4465 4.71396H10.7077V4.93816V15.277V15.6446H10.443H1.32721H1.0625V15.2769V1.51104V1.14648H1.32721H7.47873H7.61507V1.51104V1.76152V4.21396V4.23581V4.47193V4.67483C7.5785 4.6232 7.54848 4.5659 7.52601 4.50455C7.49479 4.41935 7.47873 4.32803 7.47873 4.23581V2.01104V1.51104H6.97873H1.82721H1.32721V2.01104V14.7769V15.2769H1.82721H10.443L10.4463 5.43807H10.4465V4.93807L9.94647 4.9379V4.93807H8.09989C8.01832 4.93807 7.93754 4.91991 7.86218 4.88461C7.78681 4.84932 7.71834 4.7976 7.66066 4.73238C7.65532 4.72635 7.65008 4.72021 7.64495 4.71396H7.68149H7.94209H8.09989H8.11507H10.2843H10.4465ZM7.97873 1.51104V1.14648H7.98639L8.34804 1.55545L8.53027 1.76152H8.11507L7.97873 1.88211V1.76152V1.51104ZM8.61507 2.3268V1.85741L10.2568 3.71396H9.84203L8.61507 2.3268Z"
                  fill="white"
                  fill-opacity="0.19"
                  stroke="white"
                />
                <mask id="path-2-inside-1_477_2143" fill="white">
                  <path d="M8.53161 6.26758H2.92188V6.98856H8.53161V6.26758Z" />
                </mask>
                <path
                  d="M8.53161 6.26758H2.92188V6.98856H8.53161V6.26758Z"
                  fill="white"
                  fill-opacity="0.19"
                />
                <path
                  d="M2.92188 6.26758V5.26758H1.92188V6.26758H2.92188ZM8.53161 6.26758H9.53161V5.26758H8.53161V6.26758ZM8.53161 6.98856V7.98856H9.53161V6.98856H8.53161ZM2.92188 6.98856H1.92188V7.98856H2.92188V6.98856ZM2.92188 7.26758H8.53161V5.26758H2.92188V7.26758ZM7.53161 6.26758V6.98856H9.53161V6.26758H7.53161ZM8.53161 5.98856H2.92188V7.98856H8.53161V5.98856ZM3.92188 6.98856V6.26758H1.92188V6.98856H3.92188Z"
                  fill="white"
                  mask="url(#path-2-inside-1_477_2143)"
                />
                <mask id="path-4-inside-2_477_2143" fill="white">
                  <path d="M8.49917 8.79102H2.92188V9.512H8.49917V8.79102Z" />
                </mask>
                <path
                  d="M8.49917 8.79102H2.92188V9.512H8.49917V8.79102Z"
                  fill="white"
                  fill-opacity="0.19"
                />
                <path
                  d="M2.92188 8.79102V7.79102H1.92188V8.79102H2.92188ZM8.49917 8.79102H9.49917V7.79102H8.49917V8.79102ZM8.49917 9.512V10.512H9.49917V9.512H8.49917ZM2.92188 9.512H1.92188V10.512H2.92188V9.512ZM2.92188 9.79102H8.49917V7.79102H2.92188V9.79102ZM7.49917 8.79102V9.512H9.49917V8.79102H7.49917ZM8.49917 8.512H2.92188V10.512H8.49917V8.512ZM3.92188 9.512V8.79102H1.92188V9.512H3.92188Z"
                  fill="white"
                  mask="url(#path-4-inside-2_477_2143)"
                />
                <mask id="path-6-inside-3_477_2143" fill="white">
                  <path d="M5.91723 11.3105H2.92188V12.0315H5.91723V11.3105Z" />
                </mask>
                <path
                  d="M5.91723 11.3105H2.92188V12.0315H5.91723V11.3105Z"
                  fill="white"
                  fill-opacity="0.19"
                />
                <path
                  d="M2.92188 11.3105V10.3105H1.92188V11.3105H2.92188ZM5.91723 11.3105H6.91723V10.3105H5.91723V11.3105ZM5.91723 12.0315V13.0315H6.91723V12.0315H5.91723ZM2.92188 12.0315H1.92188V13.0315H2.92188V12.0315ZM2.92188 12.3105H5.91723V10.3105H2.92188V12.3105ZM4.91723 11.3105V12.0315H6.91723V11.3105H4.91723ZM5.91723 11.0315H2.92188V13.0315H5.91723V11.0315ZM3.92188 12.0315V11.3105H1.92188V12.0315H3.92188Z"
                  fill="white"
                  mask="url(#path-6-inside-3_477_2143)"
                />
                <path
                  d="M7.92567 12.9778C7.94245 12.984 7.95943 12.9898 7.97661 12.9951L7.81415 13.2972L7.71062 13.4896L7.6505 13.4887L7.79679 13.2171L7.92567 12.9778ZM8.53361 12.9974C8.55106 12.9922 8.56831 12.9865 8.58535 12.9803L8.7129 13.2171L8.85919 13.4887L8.79838 13.4897L8.69484 13.2971L8.53361 12.9974Z"
                  fill="white"
                  fill-opacity="0.19"
                  stroke="white"
                />
              </svg>
              <span className="text-[12px] md:text-[10px] lg:text-[10px] text-white">
                History
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
