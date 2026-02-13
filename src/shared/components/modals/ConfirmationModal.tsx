

export interface ConfirmationModalData {
  text1?: string;
  text2?: string;
  btn1Handler?: () => void;
  btn1Text?: string;
  btn2Handler?: () => void;
  btn2Text?: string;
}

interface ConfirmationModalProps {
  modalData: ConfirmationModalData | null;
}

const ConfirmationModal = ({ modalData }: ConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-black/40 backdrop-blur-sm">
      <div className="w-[517px] h-[242px] flex flex-col items-center justify-center rounded-2xl bg-white px-10 shadow-2xl transition-all duration-300">
        <p className="text-[22px] font-bold text-cem-neutral-gray-900 text-center leading-tight">
          {modalData?.text1}
        </p>
        <p className="mt-2 leading-normal text-cem-neutral-gray-600 text-center text-[15px]">
          {modalData?.text2}
        </p>
        <div className="flex items-center justify-center gap-x-6 mt-6">
          <button
            className="cursor-pointer rounded-xl bg-[#d1e7e9] text-[#006D77] hover:bg-[#b8dadc] py-2.5 px-10 font-bold transition-all duration-300"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
          <button
            className="cursor-pointer rounded-xl bg-cem-primary text-white hover:bg-cem-primary-dark py-2.5 px-10 font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cem-primary/20"
            onClick={modalData?.btn1Handler}
          >
            {modalData?.btn1Text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

