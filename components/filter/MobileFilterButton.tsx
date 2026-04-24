import { TbSearch } from 'react-icons/tb';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import MobileFilter from './MobileFilter';

const MobileFilterButton = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div>
      <div className="h-[rem(50px)] mb-[rem(120px)] fixed w-[100%] z-10 bg-white border-2 -mt-2 p-2">
        <button
          type="button"
          aria-label="Update mic search"
          onClick={open}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors"
        >
          <TbSearch size={20} />
          Update search
        </button>
      </div>
      <Modal opened={opened} onClose={close} title="Update Mic Search" centered>
        <MobileFilter onSubmit={close} />
      </Modal>
    </div>
  );
};

export default MobileFilterButton;
