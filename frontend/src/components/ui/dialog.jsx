import React, { useState, createContext, useContext } from 'react';

const DialogContext = createContext();

const Dialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false);

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => handleOpenChange(false)}
          />
        </div>
      )}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children, asChild = false, ...props }) => {
  const { setIsOpen } = useContext(DialogContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e) => {
        children.props.onClick?.(e);
        setIsOpen(true);
      }
    });
  }

  return (
    <button
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        setIsOpen(true);
      }}
    >
      {children}
    </button>
  );
};

const DialogContent = ({ children, className = '', ...props }) => {
  const { isOpen, setIsOpen } = useContext(DialogContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`relative z-50 w-full max-w-lg bg-white rounded-lg shadow-lg ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className = '', ...props }) => {
  return (
    <h2
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
};

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle };