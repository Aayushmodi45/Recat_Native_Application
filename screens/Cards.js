import React from 'react';
import { ScrollView, View } from 'react-native';
// Adjust the path as needed
import InfoCard from './InfoCard';
const Cards = () => {
  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <InfoCard
          title="Beautiful Beach"
          description="Relax at the serene beach with crystal clear waters."
          image="https://media.istockphoto.com/id/610041376/photo/beautiful-sunrise-over-the-sea.jpg?s=612x612&w=0&k=20&c=R3Tcc6HKc1ixPrBc7qXvXFCicm8jLMMlT99MfmchLNA="
        />
        <InfoCard
          title="Mountain Hike"
          description="Explore the breathtaking mountain trails."
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRacs1nOie6Q-A83LGsIeIahsUfY21gM1zVaA&s"
        />
        <InfoCard
          title="Paragliding"
          description="It's a thrilling way to experience the world from above, and is accessible to a wide range of people. "
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRJVpRuuO1_53cLGl9XD2s4uo64DD1lCZVMQ&s"
        />
      </View>
    </ScrollView>
  );
};

export default Cards;
