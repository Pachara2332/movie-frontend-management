import React from 'react';
import { Trash2 } from 'lucide-react';

import ConfirmDialog from '../common/ConfirmDialog';

interface DeleteMovieDialogProps {
  movieTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteMovieDialog: React.FC<DeleteMovieDialogProps> = ({
  movieTitle,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <ConfirmDialog
      title="Delete Movie"
      description={
        <>
          Are you sure you want to delete <strong className="text-white">"{movieTitle}"</strong>? This action cannot be
          undone.
        </>
      }
      confirmLabel="Delete"
      loadingLabel="Deleting..."
      icon={Trash2}
      tone="danger"
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default DeleteMovieDialog;
